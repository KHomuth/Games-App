import { GENRE_KEY_TO_SLUG, PLATFORM_KEY_TO_ID, slugifyGenreInput } from './maps';
import { RawgConfigError, RawgHttpError } from './errors';
import type { RawgGame, RawgGamesListResponse } from './types';

const RAWG_BASE = 'https://api.rawg.io/api';

export type SearchMode = 'gameName' | 'platform' | 'genre';

export type SearchGamesInput = {
  mode: SearchMode;
  /** Raw user text (trimmed by caller when needed). */
  term: string;
};

function getApiKey(): string {
  const key =
    process.env.EXPO_PUBLIC_RAWG_API_KEY?.trim() ||
    process.env.EXPO_PUBLIC_API_KEY?.trim();
  if (!key) {
    throw new RawgConfigError(
      'Missing API key. Set EXPO_PUBLIC_RAWG_API_KEY in a .env file (see README).'
    );
  }
  return key;
}

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

/**
 * Performs a single RAWG games search with optional abort for stale requests.
 */
export async function searchGames(
  input: SearchGamesInput,
  options?: { signal?: AbortSignal }
): Promise<RawgGame[]> {
  const key = getApiKey();
  const url = new URL(`${RAWG_BASE}/games`);
  url.searchParams.set('key', key);

  const normalized = input.term.toLowerCase().trim();

  if (!normalized) {
    return [];
  }

  if (input.mode === 'gameName') {
    url.searchParams.set('search', normalized);
  } else if (input.mode === 'platform') {
    const platformId = PLATFORM_KEY_TO_ID[normalized];
    if (!platformId) {
      return [];
    }
    url.searchParams.set('platforms', String(platformId));
  } else {
    const slug = GENRE_KEY_TO_SLUG[normalized] ?? slugifyGenreInput(input.term);
    url.searchParams.set('genres', slug);
  }

  const response = await fetch(url.toString(), {
    signal: options?.signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new RawgHttpError(response.status, text);
  }

  const json: unknown = await response.json();
  return parseList(json);
}
