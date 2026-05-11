/**
 * Subset of fields returned by RAWG for list endpoints.
 * @see https://rawg.io/apidocs
 */
export type RawgPlatformSlot = {
  platform?: { id?: number; name?: string; slug?: string };
};

export type RawgGenre = {
  id?: number;
  name?: string;
  slug?: string;
};

export type RawgGame = {
  id: number;
  name: string;
  released: string | null;
  tba: boolean;
  background_image: string | null;
  metacritic: number | null;
  platforms?: RawgPlatformSlot[];
  genres?: RawgGenre[];
};

export type RawgGamesListResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: unknown[];
};
