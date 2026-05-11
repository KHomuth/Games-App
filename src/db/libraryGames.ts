import type { RawgGame } from '@/src/api/rawg/types';

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
    added_at: string;
  }>(
    `SELECT id, rawg_id, name, background_image, released, metacritic, platforms_json, genres_json, added_at
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
    addedAt: row.added_at,
  }));
}

export type AddGameResult = { ok: true } | { ok: false; code: 'ALREADY_SAVED' };

/**
 * Persists a game from search results into the user's library.
 */
export async function addGameToLibrary(userId: number, game: RawgGame): Promise<AddGameResult> {
  const platforms = (game.platforms ?? [])
    .map((p) => p?.platform?.name)
    .filter((n): n is string => typeof n === 'string');
  const genres = (game.genres ?? [])
    .map((g) => g?.name)
    .filter((n): n is string => typeof n === 'string');

  const db = await getDatabase();

  try {
    await db.runAsync(
      `INSERT INTO library_games (user_id, rawg_id, name, background_image, released, metacritic, platforms_json, genres_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        userId,
        game.id,
        game.name,
        game.background_image ?? null,
        game.released ?? null,
        game.metacritic ?? null,
        JSON.stringify(platforms),
        JSON.stringify(genres),
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
