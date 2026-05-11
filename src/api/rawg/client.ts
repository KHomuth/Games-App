import { getRawgApiKey } from './config';
import {
  findBestGenreMatch,
  findBestPlatformMatch,
  getAllGenres,
  getAllPlatforms,
} from './metadata';
import { RawgHttpError } from './errors';
import type { RawgGame, RawgGamesListResponse } from './types';

const RAWG_BASE = 'https://api.rawg.io/api';

export type SearchMode = 'gameName' | 'platform' | 'genre';

export type SearchGamesInput = {
  mode: SearchMode;
  /** Raw user text (trimmed by caller when needed). */
  term: string;
  /** Optional full RAWG URL for fetching a specific page (e.g. `next`). */
  pageUrl?: string;
};

export type SearchGamesOutput = {
  games: RawgGame[];
  /** RAWG absolute URL for the next page, if any. */
  nextPageUrl: string | null;
  /** Total number of matching games from RAWG, when available. */
  totalCount: number | null;
  /** Shown when platform/genre mode resolves (e.g. "Platform: PC"). */
  filterDescription?: string;
  /** True when the query did not match any platform/genre from RAWG catalogs. */
  filterUnmatched?: boolean;
};

function parseGame(raw: unknown): RawgGame | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const id = o.id;
  const name = o.name;
  if (typeof id !== 'number' || typeof name !== 'string') return null;

  return {
    id,
    name,
    released: typeof o.released === 'string' ? o.released : null,
    tba: Boolean(o.tba),
    background_image: typeof o.background_image === 'string' ? o.background_image : null,
    metacritic: typeof o.metacritic === 'number' ? o.metacritic : null,
    platforms: Array.isArray(o.platforms) ? (o.platforms as RawgGame['platforms']) : [],
    genres: Array.isArray(o.genres) ? (o.genres as RawgGame['genres']) : [],
  };
}

function parseList(json: unknown): {
  games: RawgGame[];
  nextPageUrl: string | null;
  totalCount: number | null;
} {
  const body = json as RawgGamesListResponse;
  const rows = body && Array.isArray(body.results) ? body.results : [];
  const games = rows.map(parseGame).filter((g): g is RawgGame => g !== null);
  return {
    games,
    nextPageUrl: typeof body?.next === 'string' ? body.next : null,
    totalCount: typeof body?.count === 'number' ? body.count : null,
  };
}

async function fetchGamesPage(url: URL | string, signal?: AbortSignal): Promise<SearchGamesOutput> {
  const response = await fetch(url.toString(), {
    signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new RawgHttpError(response.status, text);
  }

  const json: unknown = await response.json();
  return parseList(json);
}

function normalizePlatformSearchTerm(term: string): string {
  const normalized = term.trim().toLowerCase();

  // PlayStation
  if (normalized === 'ps5') return 'PlayStation 5';
  if (normalized === 'ps4') return 'PlayStation 4';
  if (normalized === 'ps3') return 'PlayStation 3';
  if (normalized === 'ps2') return 'PlayStation 2';
  if (normalized === 'ps1') return 'PlayStation';

  // Xbox
  if (normalized === 'xsx' || normalized === 'xbox series x') return 'Xbox Series S/X';
  if (normalized === 'xss' || normalized === 'xbox series s') return 'Xbox Series S/X';

  // Nintendo
  if (normalized === 'switch') return 'Nintendo Switch';

  // Game Boy
  if (normalized === 'gb') return 'Game Boy';
  if (normalized === 'gbc' || normalized === 'gameboy color') return 'Game Boy Color';
  if (normalized === 'gba' || normalized === 'gameboy advance') return 'Game Boy Advance';

  return term;
}

/**
 * Searches games using RAWG: title search, or platform/genre filters resolved from live /platforms and /genres catalogs.
 */
export async function searchGames(
  input: SearchGamesInput,
  options?: { signal?: AbortSignal }
): Promise<SearchGamesOutput> {
  const key = getRawgApiKey();
  const url = new URL(`${RAWG_BASE}/games`);
  url.searchParams.set('key', key);

  const trimmed = input.term.trim();
  const normalized = trimmed.toLowerCase();

  if (!normalized) {
    return { games: [], nextPageUrl: null, totalCount: null };
  }

  if (input.pageUrl) {
    const data = await fetchGamesPage(input.pageUrl, options?.signal);
    return {
      games: data.games,
      nextPageUrl: data.nextPageUrl,
      totalCount: data.totalCount,
    };
  }

  if (input.mode === 'gameName') {
    url.searchParams.set('search', normalized);
    const data = await fetchGamesPage(url, options?.signal);
    return {
      games: data.games,
      nextPageUrl: data.nextPageUrl,
      totalCount: data.totalCount,
    };
  }

  if (input.mode === 'platform') {
    const platforms = await getAllPlatforms(options?.signal);
    const match = findBestPlatformMatch(normalizePlatformSearchTerm(trimmed), platforms);
    if (!match) {
      return { games: [], nextPageUrl: null, totalCount: null, filterUnmatched: true };
    }
    url.searchParams.set('platforms', String(match.id));
    const data = await fetchGamesPage(url, options?.signal);
    return {
      games: data.games,
      nextPageUrl: data.nextPageUrl,
      totalCount: data.totalCount,
      filterDescription: `Platform: ${match.name}`,
    };
  }

  const genres = await getAllGenres(options?.signal);
  const match = findBestGenreMatch(trimmed, genres);
  if (!match) {
    return { games: [], nextPageUrl: null, totalCount: null, filterUnmatched: true };
  }
  url.searchParams.set('genres', match.slug);
  const data = await fetchGamesPage(url, options?.signal);
  return {
    games: data.games,
    nextPageUrl: data.nextPageUrl,
    totalCount: data.totalCount,
    filterDescription: `Genre: ${match.name}`,
  };
}
