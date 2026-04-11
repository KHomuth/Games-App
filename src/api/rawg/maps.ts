/**
 * Maps friendly platform keywords to RAWG platform IDs.
 */
export const PLATFORM_KEY_TO_ID: Readonly<Record<string, number>> = {
  pc: 4,
  computer: 4,
  steam: 4,
  ps4: 18,
  'ps 4': 18,
  'playstation 4': 18,
  'playstation-4': 18,
  ps5: 187,
  'ps 5': 187,
  'playstation 5': 187,
  'playstation-5': 187,
  'xbox one': 1,
  'xbox-one': 1,
  xone: 1,
  'xbox series x': 186,
  'xbox series s': 186,
  'xbox series': 186,
  switch: 7,
  'nintendo switch': 7,
  'nintendo-switch': 7,
};

/**
 * Maps genre keywords to RAWG genre slugs.
 */
export const GENRE_KEY_TO_SLUG: Readonly<Record<string, string>> = {
  action: 'action',
  indie: 'indie',
  adventure: 'adventure',
  rpg: 'role-playing-games-rpg',
  'role playing': 'role-playing-games-rpg',
  'role-playing': 'role-playing-games-rpg',
  shooter: 'shooter',
  fps: 'shooter',
  mmo: 'massively-multiplayer',
  mmorpg: 'massively-multiplayer',
  strategy: 'strategy',
  casual: 'casual',
  simulation: 'simulation',
  puzzle: 'puzzle',
  racing: 'racing',
  sports: 'sports',
  fighting: 'fighting',
};

export function slugifyGenreInput(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-');
}
