export { searchGames } from './client';
export type { SearchGamesInput, SearchGamesOutput } from './client';
export { ensureRawgCatalogFresh, getAllGenres, getAllPlatforms } from './metadata';
export type { RawgGenreMeta, RawgPlatformMeta } from './catalogTypes';
export { RawgConfigError, RawgHttpError } from './errors';
export type { RawgGame } from './types';
