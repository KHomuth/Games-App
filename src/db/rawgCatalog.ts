import type { RawgGenreMeta, RawgPlatformMeta } from '@/src/api/rawg/catalogTypes';

import { getDatabase } from './database';

const SYNC_KEY = 'rawg_catalog_synced_at';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type CatalogOption = { id: number; label: string; slug: string };

async function getSyncedAt(): Promise<number | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_kv WHERE key = ? LIMIT 1;',
    [SYNC_KEY]
  );
  if (!row?.value) return null;
  const ts = Number(row.value);
  return Number.isNaN(ts) ? null : ts;
}

async function setSyncedAt(ms: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO app_kv (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [SYNC_KEY, String(ms)]
  );
}

export async function listPlatformsFromDb(): Promise<RawgPlatformMeta[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ id: number; name: string; slug: string }>(
    'SELECT id, name, slug FROM rawg_platforms ORDER BY name COLLATE NOCASE ASC;'
  );
  return rows.map((row) => ({ id: row.id, name: row.name, slug: row.slug }));
}

export async function listGenresFromDb(): Promise<RawgGenreMeta[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ id: number; name: string; slug: string }>(
    'SELECT id, name, slug FROM rawg_genres ORDER BY name COLLATE NOCASE ASC;'
  );
  return rows.map((row) => ({ id: row.id, name: row.name, slug: row.slug }));
}

export async function isCatalogStale(): Promise<boolean> {
  const [platforms, syncedAt] = await Promise.all([listPlatformsFromDb(), getSyncedAt()]);
  if (!platforms.length) return true;
  if (syncedAt == null) return true;
  return Date.now() - syncedAt > TTL_MS;
}

async function replaceCatalog(
  platforms: RawgPlatformMeta[],
  genres: RawgGenreMeta[]
): Promise<void> {
  const db = await getDatabase();
  await db.execAsync('BEGIN;');
  try {
    await db.execAsync('DELETE FROM rawg_platforms;');
    await db.execAsync('DELETE FROM rawg_genres;');
    for (const p of platforms) {
      await db.runAsync('INSERT INTO rawg_platforms (id, name, slug) VALUES (?, ?, ?);', [
        p.id,
        p.name,
        p.slug,
      ]);
    }
    for (const g of genres) {
      await db.runAsync('INSERT INTO rawg_genres (id, name, slug) VALUES (?, ?, ?);', [
        g.id,
        g.name,
        g.slug,
      ]);
    }
    await setSyncedAt(Date.now());
    await db.execAsync('COMMIT;');
  } catch (error) {
    await db.execAsync('ROLLBACK;');
    throw error;
  }
}

/**
 * Persists platform/genre catalogs from RAWG (used after fetchAllPages in metadata).
 */
export async function saveCatalogToDb(
  platforms: RawgPlatformMeta[],
  genres: RawgGenreMeta[]
): Promise<void> {
  await replaceCatalog(platforms, genres);
}

export function toPlatformOptions(platforms: RawgPlatformMeta[]): CatalogOption[] {
  return platforms.map((p) => ({ id: p.id, label: p.name, slug: p.slug }));
}

export function toGenreOptions(genres: RawgGenreMeta[]): CatalogOption[] {
  return genres.map((g) => ({ id: g.id, label: g.name, slug: g.slug }));
}
