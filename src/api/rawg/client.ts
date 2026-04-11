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
};

export type SearchGamesOutput = {
  games: RawgGame[];
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

function parseList(json: unknown): RawgGame[] {
  const body = json as RawgGamesListResponse;
  if (!body || !Array.isArray(body.results)) return [];
  return body.results.map(parseGame).filter((g): g is RawgGame => g !== null);
}

async function fetchGamesPage(url: URL, signal?: AbortSignal): Promise<RawgGame[]> {
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
    return { games: [] };
  }

  if (input.mode === 'gameName') {
    url.searchParams.set('search', normalized);
    const games = await fetchGamesPage(url, options?.signal);
    return { games };
  }

  if (input.mode === 'platform') {
    const platforms = await getAllPlatforms(options?.signal);
    const match = findBestPlatformMatch(trimmed, platforms);
    if (!match) {
      return { games: [], filterUnmatched: true };
    }
    url.searchParams.set('platforms', String(match.id));
    const games = await fetchGamesPage(url, options?.signal);
    return {
      games,
      filterDescription: `Platform: ${match.name}`,
    };
  }

  const genres = await getAllGenres(options?.signal);
  const match = findBestGenreMatch(trimmed, genres);
  if (!match) {
    return { games: [], filterUnmatched: true };
  }
  url.searchParams.set('genres', match.slug);
  const games = await fetchGamesPage(url, options?.signal);
  return {
    games,
    filterDescription: `Genre: ${match.name}`,
  };
}
