import type { RawgGenreMeta, RawgPlatformMeta } from '@/src/api/rawg/catalogTypes';

import type { GameFilters } from './types';

export function describeFilters(
  filters: GameFilters,
  platforms: RawgPlatformMeta[],
  genres: RawgGenreMeta[]
): string | null {
  const parts: string[] = [];

  const q = filters.query.trim();
  if (q) parts.push(`Title: “${q}”`);

  if (filters.platformIds.length) {
    const names = filters.platformIds
      .map((id) => platforms.find((p) => p.id === id)?.name)
      .filter((n): n is string => typeof n === 'string');
    if (names.length) parts.push(`Platforms: ${names.join(', ')}`);
  }

  if (filters.genreSlugs.length) {
    const names = filters.genreSlugs
      .map((slug) => genres.find((g) => g.slug === slug)?.name)
      .filter((n): n is string => typeof n === 'string');
    if (names.length) parts.push(`Genres: ${names.join(', ')}`);
  }

  return parts.length ? parts.join(' · ') : null;
}
