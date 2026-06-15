export type GameFilters = {
  /** Case-insensitive substring on game title. */
  query: string;
  platformIds: number[];
  genreSlugs: string[];
};

export const EMPTY_GAME_FILTERS: GameFilters = {
  query: '',
  platformIds: [],
  genreSlugs: [],
};

export function hasActiveFilters(filters: GameFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.platformIds.length > 0 ||
    filters.genreSlugs.length > 0
  );
}
