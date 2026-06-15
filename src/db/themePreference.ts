import { getDatabase } from './database';

import type { ColorMode } from '@/src/theme/colors';

const THEME_KEY = 'color_mode';

export async function getStoredColorMode(): Promise<ColorMode | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_kv WHERE key = ? LIMIT 1;',
    [THEME_KEY]
  );
  if (row?.value === 'light' || row?.value === 'dark') {
    return row.value;
  }
  return null;
}

export async function setStoredColorMode(mode: ColorMode): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO app_kv (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [THEME_KEY, mode]
  );
}
