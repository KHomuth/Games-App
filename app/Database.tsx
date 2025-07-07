import * as SQLite from 'expo-sqlite';

export async function registerUser(email: string, password: string): Promise<boolean> {
  let db;
  try {
    db = await SQLite.openDatabaseAsync('databaseName');
  } catch (error) {
    console.error('Failed to open database:', error);
    return false;
  }

  try {
    await db.withTransactionAsync(async () => {
      // Create users table if it doesn't exist (safe to do on every register)
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);

      // Insert the new user
      await db.runAsync(
        'INSERT INTO users (email, password) VALUES (?, ?);',
        [email, password]
      );
    });
    return true; // Success
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
}