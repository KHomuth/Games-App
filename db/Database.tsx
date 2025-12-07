import * as SQLite from 'expo-sqlite';

// Verwenden Sie einen eindeutigen Namen, um Konflikte zu vermeiden und die Initialisierung zu erzwingen
const DATABASE_NAME = 'games_db_v1';

// --- TYP DEFINITIONEN ---

interface PlatformData {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
  released_at?: string;
}

interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface FavoriteGameDB {
  id: number;
  name: string;
  released: string;
  background_image: string;
  metacritic: number;
  platforms: string; // JSON String
  genres: string;    // JSON String
}

// Typ der Daten, nachdem sie für die App verarbeitet wurden (JSON geparsed, ready für LibraryScreen)
export interface LibraryItem {
  id: string; // Für keyExtractor (String)
  title: string; // Entspricht 'name'
  releaseDate: string; // Formatiertes Releasedatum
  genre: string; // Haupt-Genre-Name
  metacritic: number;
  platform: string[]; // Array mit allen Plattform-Namen
}


// ----------------------------------------------------------------------
// INITIALISIERUNG DER DATENBANK UND TABELLEN (ZENTRALE FUNKTION)
// ----------------------------------------------------------------------

/**
 * Öffnet die Datenbank und erstellt alle notwendigen Tabellen, falls sie noch nicht existieren.
 * @returns true bei Erfolg, false bei Fehler.
 */
export async function initializeDatabase(): Promise<boolean> {
  let db: SQLite.SQLiteDatabase | undefined;
  try {
    // Hier wird die Datenbankverbindung aufgebaut
    db = await SQLite.openDatabaseAsync(DATABASE_NAME, {useNewConnection: true});
  } catch (error) {
    console.error('Failed to open database during initialization:', error);
    return false;
  }
  
  if (!db) {
    console.error('DB object is null after opening attempt in initializeDatabase.');
    return false;
  }

  try {
    // Tabellen erstellen (DDL-Operationen)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS favorite_games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        released TEXT,
        background_image TEXT,
        metacritic INTEGER,
        platforms TEXT,
        genres TEXT
      );
    `);
    return true; // Erfolg
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}


// ----------------------------------------------------------------------
// FUNKTION ZUM REGISTRIEREN DES BENUTZERS
// ----------------------------------------------------------------------

export async function registerUser(email: string, password: string): Promise<boolean> {
  let db: SQLite.SQLiteDatabase | undefined;
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME, {useNewConnection: true});
  } catch (error) {
    console.error('Failed to open database (registerUser):', error);
    return false;
  }
  
  if (!db) {
    console.error('DB object is null after opening attempt in registerUser.');
    return false;
  }

  try {
    await db.withTransactionAsync(async () => {
      // NUR Daten einfügen (Tabellenerstellung erfolgt in initializeDatabase)
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


// ----------------------------------------------------------------------
// FUNKTION ZUM SPEICHERN EINES FAVORITEN-SPIELS
// ----------------------------------------------------------------------

export async function favoriteGames(
  name: string, 
  released: string, 
  background_image: string, 
  metacritic: number, 
  platforms: PlatformData[], 
  genres: Genre[]
): Promise<boolean> {
  let db: SQLite.SQLiteDatabase | undefined;
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME, {useNewConnection: true}); 
  } catch (error) {
    console.error('Failed to open database (favoriteGames):', error);
    return false;
  }
  
  if (!db) {
    console.error('DB object is null after opening attempt in favoriteGames.');
    return false;
  }

  // Konvertiere die komplexen Arrays in JSON-Strings
  const platformsJson = JSON.stringify(platforms);
  const genresJson = JSON.stringify(genres);

  try {
    await db.withTransactionAsync(async () => {
      // NUR Daten einfügen (Tabellenerstellung erfolgt in initializeDatabase)
      await db.runAsync(
        `INSERT INTO favorite_games 
         (name, released, background_image, metacritic, platforms, genres) 
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          name, 
          released, 
          background_image, 
          metacritic, 
          platformsJson,
          genresJson
        ]
      );
    });
    return true;
  } catch (error) {
    console.error('Error inserting favorite game:', error);
    return false;
  }
}


// ----------------------------------------------------------------------
// FUNKTION ZUM LÖSCHEN EINES FAVORITEN-SPIELS
// ----------------------------------------------------------------------

/**
 * Löscht ein Spiel anhand seines Namens aus den Favoriten.
 * @param name Der eindeutige Name des zu löschenden Spiels.
 * @returns true bei Erfolg, false bei Fehler.
 */
export async function removeFavoriteGame(name: string): Promise<boolean> {
  let db: SQLite.SQLiteDatabase | undefined;
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME, {useNewConnection: true});
  } catch (error) {
    console.error('Failed to open database (removeFavoriteGame):', error);
    return false;
  }
  
  if (!db) {
    console.error('DB object is null after opening attempt in removeFavoriteGame.');
    return false;
  }

  try {
    await db.runAsync('DELETE FROM favorite_games WHERE name = ?;', [name]);
    return true;
  } catch (error) {
    console.error('Error deleting favorite game:', error);
    return false;
  }
}


// ----------------------------------------------------------------------
// FUNKTION ZUM ABRUFEN ALLER FAVORITEN-SPIELE
// ----------------------------------------------------------------------

export async function getFavoriteGames(): Promise<LibraryItem[]> {
  let db: SQLite.SQLiteDatabase | undefined;
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME, {useNewConnection: true});
  } catch (error) {
    console.error('Failed to open database (getFavoriteGames):', error);
    return [];
  }
  
  if (!db) {
    console.error('DB object is null after opening attempt in getFavoriteGames.');
    return [];
  }

  try {
    // Ruft alle Spiele aus der Datenbank als FavoriteGameDB-Typ ab
    const allGames = await db.getAllAsync<FavoriteGameDB>('SELECT * FROM favorite_games;');
    
    return allGames.map(game => {
      let parsedPlatforms: PlatformData[] = [];
      let parsedGenres: Genre[] = [];

      try {
        // Parst die JSON-Strings, die die Plattformen und Genres enthalten
        parsedPlatforms = JSON.parse(game.platforms);
        parsedGenres = JSON.parse(game.genres);
      } catch (e) {
        console.error("Fehler beim Parsen von JSON für Spiel:", game.name, e);
      }

      return {
        id: game.id.toString(),
        title: game.name,
        // Datum vom Format YYYY-MM-DD in DD.MM.YYYY umwandeln
        releaseDate: game.released ? game.released.split('-').reverse().join('.') : '-',
        // Nur den Namen des ersten Genres für die Anzeige verwenden
        genre: parsedGenres.length > 0 ? parsedGenres[0].name : 'N/A',
        metacritic: game.metacritic,
        // Erstellt ein einfaches Array von Platform-Namen für die UI-Logik
        platform: parsedPlatforms.map(p => p.platform.name), 
      } as LibraryItem;
    });

  } catch (error) {
    console.error('Error fetching favorite games:', error);
    return [];
  }
}