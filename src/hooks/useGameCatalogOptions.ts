import { useCallback, useEffect, useState } from 'react';

import type { RawgGenreMeta, RawgPlatformMeta } from '@/src/api/rawg/catalogTypes';
import { ensureRawgCatalogFresh, getAllGenres, getAllPlatforms } from '@/src/api/rawg/metadata';
import type { CatalogOption } from '@/src/db/rawgCatalog';
import { toGenreOptions, toPlatformOptions } from '@/src/db/rawgCatalog';

export function useGameCatalogOptions(): {
  platforms: RawgPlatformMeta[];
  genres: RawgGenreMeta[];
  platformOptions: CatalogOption[];
  genreOptions: CatalogOption[];
  ready: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [platforms, setPlatforms] = useState<RawgPlatformMeta[]>([]);
  const [genres, setGenres] = useState<RawgGenreMeta[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      await ensureRawgCatalogFresh();
      const [p, g] = await Promise.all([getAllPlatforms(), getAllGenres()]);
      setPlatforms(p);
      setGenres(g);
    } catch {
      setError('Could not load platform and genre filters.');
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    platforms,
    genres,
    platformOptions: toPlatformOptions(platforms),
    genreOptions: toGenreOptions(genres),
    ready,
    error,
    refresh: load,
  };
}
