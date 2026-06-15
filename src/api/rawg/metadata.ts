import { isCatalogStale, listGenresFromDb, listPlatformsFromDb, saveCatalogToDb } from '@/src/db/rawgCatalog';

import type { RawgGenreMeta, RawgPlatformMeta } from './catalogTypes';
import { getRawgApiKey } from './config';
import { RawgHttpError } from './errors';

export type { RawgGenreMeta, RawgPlatformMeta } from './catalogTypes';

const RAWG_BASE = 'https://api.rawg.io/api';

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

/** Fetches full platform + genre catalogs from RAWG (for sync / refresh). */
export async function fetchRawgCatalogFromApi(signal?: AbortSignal): Promise<{
  platforms: RawgPlatformMeta[];
  genres: RawgGenreMeta[];
}> {
  const [platforms, genres] = await Promise.all([
    fetchAllPages('/platforms', parsePlatform, signal),
    fetchAllPages('/genres', parseGenre, signal),
  ]);
  return { platforms, genres };
}

let platformsCache: RawgPlatformMeta[] | null = null;
let genresCache: RawgGenreMeta[] | null = null;

function setCaches(platforms: RawgPlatformMeta[], genres: RawgGenreMeta[]): void {
  platformsCache = platforms;
  genresCache = genres;
}

/** Loads platform catalog from memory or SQLite (must be synced first). */
export async function getAllPlatforms(): Promise<RawgPlatformMeta[]> {
  if (platformsCache?.length) return platformsCache;
  const fromDb = await listPlatformsFromDb();
  if (fromDb.length) {
    platformsCache = fromDb;
    return fromDb;
  }
  return [];
}

/** Loads genre catalog from memory or SQLite (must be synced first). */
export async function getAllGenres(): Promise<RawgGenreMeta[]> {
  if (genresCache?.length) return genresCache;
  const fromDb = await listGenresFromDb();
  if (fromDb.length) {
    genresCache = fromDb;
    return fromDb;
  }
  return [];
}

/** Fetches from RAWG, writes SQLite, refreshes in-memory cache. */
export async function syncRawgCatalogToStorage(signal?: AbortSignal): Promise<void> {
  const { platforms, genres } = await fetchRawgCatalogFromApi(signal);
  await saveCatalogToDb(platforms, genres);
  setCaches(platforms, genres);
}

/** Loads from SQLite; if missing or older than 30 days, refetches from RAWG. */
export async function ensureRawgCatalogFresh(signal?: AbortSignal): Promise<void> {
  if (!(await isCatalogStale())) {
    const [platforms, genres] = await Promise.all([listPlatformsFromDb(), listGenresFromDb()]);
    if (platforms.length && genres.length) {
      setCaches(platforms, genres);
    }
    return;
  }

  const { platforms, genres } = await fetchRawgCatalogFromApi(signal);
  if (!platforms.length || !genres.length) {
    throw new Error('RAWG catalog sync returned empty data.');
  }
  await saveCatalogToDb(platforms, genres);
  setCaches(platforms, genres);
}

export function invalidateCatalogMemoryCache(): void {
  platformsCache = null;
  genresCache = null;
}

function normalizeComparable(s: string): string {
  return s.toLowerCase().trim().replace(/[\s_-]+/g, '');
}

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
