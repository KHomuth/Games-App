import { getDatabase } from './database';

/** Persists signed-in user id on-device (replaces AsyncStorage for Expo/iOS reliability). */
const SESSION_KEY = 'session_user_id';

export async function getStoredUserId(): Promise<number | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_kv WHERE key = ? LIMIT 1;',
    [SESSION_KEY]
  );
  if (!row?.value) return null;
  const id = Number(row.value);
  return Number.isNaN(id) ? null : id;
}

export async function setStoredUserId(userId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO app_kv (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [SESSION_KEY, String(userId)]
  );
}

export async function clearStoredUserId(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM app_kv WHERE key = ?;', [SESSION_KEY]);
}
