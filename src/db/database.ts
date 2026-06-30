import * as SQLite from 'expo-sqlite';

let connection: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Opens a singleton SQLite database and applies a minimal schema.
 * All persistence is on-device (demo only; no remote backend).
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (connection) {
    return connection;
  }

  if (!initPromise) {
    initPromise = openAndMigrate();
  }

  try {
    return await initPromise;
  } catch (error) {
    initPromise = null;
    connection = null;
    throw error;
  }
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('games_app.db');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
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

    CREATE TABLE IF NOT EXISTS rawg_platforms (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rawg_genres (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL
    );
  `);

  await migrateLibraryGames(db);

  connection = db;
  return db;
}

async function migrateLibraryGames(db: SQLite.SQLiteDatabase): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(library_games);');
  const names = new Set(columns.map((column) => column.name));

  if (!names.has('description_raw')) {
    await db.execAsync('ALTER TABLE library_games ADD COLUMN description_raw TEXT;');
  }
  if (!names.has('website')) {
    await db.execAsync('ALTER TABLE library_games ADD COLUMN website TEXT;');
  }
  if (!names.has('esrb_rating')) {
    await db.execAsync('ALTER TABLE library_games ADD COLUMN esrb_rating TEXT;');
  }
  if (!names.has('developers_json')) {
    await db.execAsync(
      "ALTER TABLE library_games ADD COLUMN developers_json TEXT NOT NULL DEFAULT '[]';"
    );
  }
  if (!names.has('publishers_json')) {
    await db.execAsync(
      "ALTER TABLE library_games ADD COLUMN publishers_json TEXT NOT NULL DEFAULT '[]';"
    );
  }
}
