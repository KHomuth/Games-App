import * as SQLite from 'expo-sqlite';

let connection: SQLite.SQLiteDatabase | null = null;

/**
 * Opens a singleton SQLite database and applies a minimal schema.
 * All persistence is on-device (demo only; no remote backend).
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (connection) {
    await connection.execAsync('PRAGMA foreign_keys = ON;');
    return connection;
  }

  connection = await SQLite.openDatabaseAsync('games_app.db');
  await connection.execAsync('PRAGMA foreign_keys = ON;');

  await connection.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS library_games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      rawg_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      background_image TEXT,
      released TEXT,
      metacritic INTEGER,
      platforms_json TEXT NOT NULL DEFAULT '[]',
      genres_json TEXT NOT NULL DEFAULT '[]',
      added_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (user_id, rawg_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_library_user ON library_games (user_id);

    CREATE TABLE IF NOT EXISTS app_kv (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  return connection;
}
