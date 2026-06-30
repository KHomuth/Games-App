import { matchesTitleQuery } from '@/src/filters/matchTitleQuery';
import type { GameFilters } from '@/src/filters/types';
import { hasActiveFilters } from '@/src/filters/types';

import { getRawgApiKey } from './config';
import { RawgHttpError } from './errors';
import type { RawgGame, RawgGameDetails, RawgGamesListResponse } from './types';

const RAWG_BASE = 'https://api.rawg.io/api';

export type SearchGamesInput = {
  filters: GameFilters;
  /** Optional full RAWG URL for fetching a specific page (e.g. `next`). */
  pageUrl?: string;
};

export type SearchGamesOutput = {
  games: RawgGame[];
  nextPageUrl: string | null;
  totalCount: number | null;
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

function parseList(json: unknown, titleQuery?: string): SearchGamesOutput {
  const body = json as RawgGamesListResponse;
  const rows = body && Array.isArray(body.results) ? body.results : [];
  let games = rows.map(parseGame).filter((g): g is RawgGame => g !== null);

  const q = titleQuery?.trim();
  if (q) {
    games = games.filter((g) => matchesTitleQuery(g.name, q));
  }

  return {
    games,
    nextPageUrl: typeof body?.next === 'string' ? body.next : null,
    totalCount: typeof body?.count === 'number' ? body.count : null,
  };
}

async function fetchGamesPage(
  url: URL | string,
  options?: { signal?: AbortSignal; titleQuery?: string }
): Promise<SearchGamesOutput> {
  const response = await fetch(url.toString(), {
    signal: options?.signal,
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new RawgHttpError(response.status, text);
  }

  const json: unknown = await response.json();
  return parseList(json, options?.titleQuery);
}

function applyFiltersToUrl(url: URL, filters: GameFilters): void {
  const q = filters.query.trim().toLowerCase();
  if (q) {
    url.searchParams.set('search', q);
    // RAWG defaults to fuzzy search ("grand" can match "Gran"); tighten server-side matching.
    url.searchParams.set('search_precise', 'true');
  }
  if (filters.platformIds.length) {
    url.searchParams.set('platforms', filters.platformIds.join(','));
  }
  if (filters.genreSlugs.length) {
    url.searchParams.set('genres', filters.genreSlugs.join(','));
  }
}

/**
 * Searches games on RAWG using title plus optional platform/genre multiselect filters.
 */
export async function searchGames(
  input: SearchGamesInput,
  options?: { signal?: AbortSignal }
): Promise<SearchGamesOutput> {
  const titleQuery = input.filters.query.trim() || undefined;

  if (input.pageUrl) {
    return fetchGamesPage(input.pageUrl, { signal: options?.signal, titleQuery });
  }

  if (!hasActiveFilters(input.filters)) {
    return { games: [], nextPageUrl: null, totalCount: null };
  }

  const key = getRawgApiKey();
  const url = new URL(`${RAWG_BASE}/games`);
  url.searchParams.set('key', key);
  applyFiltersToUrl(url, input.filters);

  return fetchGamesPage(url, { signal: options?.signal, titleQuery });
}

export async function getGameDetails(
  gameId: number,
  options?: { signal?: AbortSignal }
): Promise<RawgGameDetails> {
  const key = getRawgApiKey();

  const response = await fetch(
    `${RAWG_BASE}/games/${gameId}?key=${key}`,
    {
      signal: options?.signal,
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new RawgHttpError(response.status, text);
  }

  return (await response.json()) as RawgGameDetails;
}