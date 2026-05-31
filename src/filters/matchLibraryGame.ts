import type { LibraryGameRow } from '@/src/db/libraryGames';

import { matchesTitleQuery } from './matchTitleQuery';
import type { GameFilters } from './types';

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

/**
 * Local library match: title substring plus AND across platform/genre multiselects.
 */
export function matchesLibraryGame(
  row: LibraryGameRow,
  filters: GameFilters,
  platformNamesById: Map<number, string>,
  genreNamesBySlug: Map<string, string>
): boolean {
  if (filters.query.trim() && !matchesTitleQuery(row.name, filters.query)) {
    return false;
  }

  if (filters.platformIds.length) {
    const selectedNames = filters.platformIds
      .map((id) => platformNamesById.get(id))
      .filter((n): n is string => typeof n === 'string')
      .map(normalize);
    const rowPlatforms = row.platforms.map(normalize);
    const hasPlatform = selectedNames.some((name) => rowPlatforms.includes(name));
    if (!hasPlatform) return false;
  }

  if (filters.genreSlugs.length) {
    const selectedNames = filters.genreSlugs
      .map((slug) => genreNamesBySlug.get(slug))
      .filter((n): n is string => typeof n === 'string')
      .map(normalize);
    const rowGenres = row.genres.map(normalize);
    const hasGenre = selectedNames.some((name) => rowGenres.includes(name));
    if (!hasGenre) return false;
  }

  return true;
}
