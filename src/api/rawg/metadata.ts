import { getRawgApiKey } from './config';
import { RawgHttpError } from './errors';

const RAWG_BASE = 'https://api.rawg.io/api';

export type RawgPlatformMeta = {
  id: number;
  name: string;
  slug: string;
};

export type RawgGenreMeta = {
  id: number;
  name: string;
  slug: string;
};

function parsePlatform(raw: unknown): RawgPlatformMeta | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'number' || typeof o.name !== 'string' || typeof o.slug !== 'string') {
    return null;
  }
  return { id: o.id, name: o.name, slug: o.slug };
}

function parseGenre(raw: unknown): RawgGenreMeta | null {
  return parsePlatform(raw) as RawgGenreMeta | null;
}

type Paginated = {
  next?: string | null;
  results?: unknown[];
};

/**
 * Follows RAWG pagination until all rows are loaded (platforms / genres catalogs).
 */
async function fetchAllPages<T>(
  initialPath: string,
  parseRow: (raw: unknown) => T | null,
  signal?: AbortSignal
): Promise<T[]> {
  const key = getRawgApiKey();
  const first = new URL(`${RAWG_BASE}${initialPath}`);
  first.searchParams.set('key', key);
  first.searchParams.set('page_size', '40');

  const out: T[] = [];
  let nextUrl: string | null = first.toString();

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      const text = await response.text();
      throw new RawgHttpError(response.status, text);
    }
    const json: unknown = await response.json();
    const body = json as Paginated;
    const batch = (body.results ?? []).map(parseRow).filter(Boolean) as T[];
    out.push(...batch);
    nextUrl = body.next ?? null;
  }

  return out;
}

let platformsCache: RawgPlatformMeta[] | null = null;
let platformsPromise: Promise<RawgPlatformMeta[]> | null = null;

let genresCache: RawgGenreMeta[] | null = null;
let genresPromise: Promise<RawgGenreMeta[]> | null = null;

/** Loads once per app session; safe for concurrent callers. */
export async function getAllPlatforms(signal?: AbortSignal): Promise<RawgPlatformMeta[]> {
  if (platformsCache) return platformsCache;
  if (!platformsPromise) {
    platformsPromise = fetchAllPages('/platforms', parsePlatform, signal)
      .then((rows) => {
        platformsCache = rows;
        return rows;
      })
      .catch((e) => {
        platformsPromise = null;
        throw e;
      });
  }
  return platformsPromise;
}

export async function getAllGenres(signal?: AbortSignal): Promise<RawgGenreMeta[]> {
  if (genresCache) return genresCache;
  if (!genresPromise) {
    genresPromise = fetchAllPages('/genres', parseGenre, signal)
      .then((rows) => {
        genresCache = rows;
        return rows;
      })
      .catch((e) => {
        genresPromise = null;
        throw e;
      });
  }
  return genresPromise;
}

function normalizeComparable(s: string): string {
  return s.toLowerCase().trim().replace(/[\s_-]+/g, '');
}

/**
 * Picks the best platform for a free-text query using name + slug (substring / prefix).
 */
export function findBestPlatformMatch(
  query: string,
  platforms: RawgPlatformMeta[]
): RawgPlatformMeta | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const qCompact = normalizeComparable(query);

  type Scored = { item: RawgPlatformMeta; score: number; tie: number };

  const scored: Scored[] = [];

  for (const p of platforms) {
    const name = p.name.toLowerCase();
    const slug = p.slug.toLowerCase();
    const nameCompact = normalizeComparable(p.name);
    const slugCompact = normalizeComparable(p.slug);

    let score = 0;
    if (name === q || slug === q) score = 100;
    else if (nameCompact === qCompact || slugCompact === qCompact) score = 95;
    else if (name.startsWith(q) || slug.startsWith(q)) score = 85;
    else if (name.includes(q) || slug.includes(q)) score = 70;
    else if (nameCompact.includes(qCompact) || slugCompact.includes(qCompact)) score = 55;
    else continue;

    scored.push({ item: p, score, tie: name.length });
  }

  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score || a.tie - b.tie);
  return scored[0].item;
}

/**
 * Picks the best genre for a free-text query (name + slug, handles e.g. "rpg" vs full slug).
 */
export function findBestGenreMatch(query: string, genres: RawgGenreMeta[]): RawgGenreMeta | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  const qCompact = normalizeComparable(query);

  type Scored = { item: RawgGenreMeta; score: number; tie: number };

  const scored: Scored[] = [];

  for (const g of genres) {
    const name = g.name.toLowerCase();
    const slug = g.slug.toLowerCase();
    const nameCompact = normalizeComparable(g.name);
    const slugCompact = normalizeComparable(g.slug);

    let score = 0;
    if (name === q || slug === q) score = 100;
    else if (nameCompact === qCompact || slugCompact === qCompact) score = 95;
    else if (name.startsWith(q) || slug.startsWith(q)) score = 85;
    else if (name.includes(q) || slug.includes(q)) score = 70;
    else if (nameCompact.includes(qCompact) || slugCompact.includes(qCompact)) score = 55;
    else continue;

    scored.push({ item: g, score, tie: name.length });
  }

  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score || a.tie - b.tie);
  return scored[0].item;
}
