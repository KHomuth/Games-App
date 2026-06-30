import type { RawgGame, RawgGameDetails } from '@/src/api/rawg/types';
import { GAME_LIST_PAGE_SIZE } from '@/src/constants/pagination';
import { matchesLibraryGame } from '@/src/filters/matchLibraryGame';
import type { GameFilters } from '@/src/filters/types';
import { getAllGenres, getAllPlatforms } from '@/src/api/rawg/metadata';

import { getDatabase } from './database';

export type LibraryGameRow = {
  localId: number;
  rawgId: number;
  name: string;
  backgroundImage: string | null;
  released: string | null;
  metacritic: number | null;
  platforms: string[];
  genres: string[];
  description: string | null;
  website: string | null;
  esrbRating: string | null;
  developers: string[];
  publishers: string[];
  addedAt: string;
};

function safeStringArray(json: string): string[] {
  try {
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

/**
 * Lists saved games for the signed-in user, newest first.
 */
export async function listLibraryGames(userId: number): Promise<LibraryGameRow[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    rawg_id: number;
    name: string;
    background_image: string | null;
    released: string | null;
    metacritic: number | null;
    platforms_json: string;
    genres_json: string;
    description_raw: string | null;
    website: string | null;
    esrb_rating: string | null;
    developers_json: string;
    publishers_json: string;
    added_at: string;
  }>(
    `SELECT id, rawg_id, name, background_image, released, metacritic, platforms_json, genres_json,
            description_raw, website, esrb_rating, developers_json, publishers_json, added_at
     FROM library_games WHERE user_id = ? ORDER BY datetime(added_at) DESC;`,
    [userId]
  );

  return rows.map((row) => ({
    localId: row.id,
    rawgId: row.rawg_id,
    name: row.name,
    backgroundImage: row.background_image,
    released: row.released,
    metacritic: row.metacritic,
    platforms: safeStringArray(row.platforms_json),
    genres: safeStringArray(row.genres_json),
    description: row.description_raw,
    website: row.website,
    esrbRating: row.esrb_rating,
    developers: safeStringArray(row.developers_json),
    publishers: safeStringArray(row.publishers_json),
    addedAt: row.added_at,
  }));
}

/**
 * RAWG ids saved for this user (for search result membership checks).
 */
export async function listLibraryRawgIds(userId: number): Promise<Set<number>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ rawg_id: number }>(
    'SELECT rawg_id FROM library_games WHERE user_id = ?;',
    [userId]
  );
  return new Set(rows.map((row) => row.rawg_id));
}

export type AddGameResult = { ok: true } | { ok: false; code: 'ALREADY_SAVED' };

/**
 * Persists a game from search results into the user's library.
 */
export async function addGameToLibrary(
  userId: number,
  game: RawgGame,
  details?: RawgGameDetails | null
): Promise<AddGameResult> {
  const platforms =
    details?.platforms
      ?.map((p) => p.platform?.name)
      .filter((n): n is string => typeof n === 'string') ??
    (game.platforms ?? [])
      .map((p) => p?.platform?.name)
      .filter((n): n is string => typeof n === 'string');

  const genres =
    details?.genres
      ?.map((g) => g.name)
      .filter((n): n is string => typeof n === 'string') ??
    (game.genres ?? [])
      .map((g) => g?.name)
      .filter((n): n is string => typeof n === 'string');

  const developers =
    details?.developers
      ?.map((d) => d.name)
      .filter((n): n is string => typeof n === 'string') ?? [];

  const publishers =
    details?.publishers
      ?.map((p) => p.name)
      .filter((n): n is string => typeof n === 'string') ?? [];

  const db = await getDatabase();

  try {
    await db.runAsync(
      `INSERT INTO library_games (
         user_id, rawg_id, name, background_image, released, metacritic,
         platforms_json, genres_json, description_raw, website, esrb_rating,
         developers_json, publishers_json
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        userId,
        game.id,
        game.name,
        game.background_image ?? null,
        details?.released ?? game.released ?? null,
        details?.metacritic ?? game.metacritic ?? null,
        JSON.stringify(platforms),
        JSON.stringify(genres),
        details?.description_raw ?? null,
        details?.website ?? null,
        details?.esrb_rating?.name ?? null,
        JSON.stringify(developers),
        JSON.stringify(publishers),
      ]
    );
    return { ok: true };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: string }).message === 'string' &&
      ((error as { message: string }).message.includes('UNIQUE') ||
        (error as { message: string }).message.includes('constraint'))
    ) {
      return { ok: false, code: 'ALREADY_SAVED' };
    }
    throw error;
  }
}

export async function removeGameFromLibrary(userId: number, rawgId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM library_games WHERE user_id = ? AND rawg_id = ?;', [userId, rawgId]);
}

export type LibrarySearchSort = 'name' | 'released' | 'metacritic' | 'added';

export type LibrarySearchResult = {
  games: LibraryGameRow[];
  total: number;
  hasMore: boolean;
};

function compareLibraryRows(
  a: LibraryGameRow,
  b: LibraryGameRow,
  sortBy: LibrarySearchSort,
  direction: 'asc' | 'desc'
): number {
  let result = 0;
  if (sortBy === 'name') {
    result = a.name.localeCompare(b.name);
  } else if (sortBy === 'released') {
    result = (a.released ?? '').localeCompare(b.released ?? '');
  } else if (sortBy === 'metacritic') {
    result = (a.metacritic ?? -1) - (b.metacritic ?? -1);
  } else {
    result = a.addedAt.localeCompare(b.addedAt);
  }
  return direction === 'asc' ? result : -result;
}

/**
 * Filters the user's library in memory, sorts, then returns one page (for Load more UX).
 */
export async function searchLibraryGames(
  userId: number,
  filters: GameFilters,
  options: {
    offset: number;
    limit?: number;
    sortBy?: LibrarySearchSort;
    sortDirection?: 'asc' | 'desc';
  }
): Promise<LibrarySearchResult> {
  const limit = options.limit ?? GAME_LIST_PAGE_SIZE;
  const sortBy = options.sortBy ?? 'added';
  const sortDirection = options.sortDirection ?? 'desc';

  const [rows, platforms, genres] = await Promise.all([
    listLibraryGames(userId),
    getAllPlatforms(),
    getAllGenres(),
  ]);

  const platformNamesById = new Map(platforms.map((p) => [p.id, p.name]));
  const genreNamesBySlug = new Map(genres.map((g) => [g.slug, g.name]));

  const filtered = rows.filter((row) =>
    matchesLibraryGame(row, filters, platformNamesById, genreNamesBySlug)
  );
  filtered.sort((a, b) => compareLibraryRows(a, b, sortBy, sortDirection));

  const slice = filtered.slice(options.offset, options.offset + limit);
  return {
    games: slice,
    total: filtered.length,
    hasMore: options.offset + limit < filtered.length,
  };
}
