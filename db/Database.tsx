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
// FUNKTION ZUM REGISTRIEREN DES BENUTZERS
// ----------------------------------------------------------------------

export async function registerUser(email: string, password: string): Promise<boolean> {
  let db;
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  } catch (error) {
    console.error('Failed to open database (registerUser):', error);
    return false;
  }
  
  // Defensive Programmierung: Prüfen, ob die Datenbankverbindung gültig ist
  if (!db) {
    console.error('DB object is null after opening attempt in registerUser.');
    return false;
  }

  try {
    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);

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
  let db;
  try {
    db = await SQLite.openDatabaseAsync(DATABASE_NAME); 
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
      await db.execAsync(`
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
    // Fängt Duplikate ab (UNIQUE Constraint auf 'name') und andere DB-Fehler
    console.error('Error inserting favorite game:', error);
    return false;
  }
}


// ----------------------------------------------------------------------
// FUNKTION ZUM ABRUFEN ALLER FAVORITEN-SPIELE
// ----------------------------------------------------------------------

export async function getFavoriteGames(): Promise<LibraryItem[]> {
    let db;
    try {
        db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    } catch (error) {
        // Dieser Fehler wird geworfen, wenn die DB-Verbindung komplett fehlschlägt
        console.error('Failed to open database (getFavoriteGames):', error);
        return [];
    }
    
    // 💡 NULL-CHECK für defensive Programmierung (löst wahrscheinlich das Problem)
    if (!db) {
      console.error('DB object is null after opening attempt in getFavoriteGames.');
      return [];
    }

    try {
        // Alle Spiele aus der Datenbank als FavoriteGameDB-Typ abrufen
        const allGames = await db.getAllAsync<FavoriteGameDB>('SELECT * FROM favorite_games;');
        
        // Daten verarbeiten und in den LibraryItem-Typ (für die Anzeige) bringen
        return allGames.map(game => {
            let parsedPlatforms: PlatformData[] = [];
            let parsedGenres: Genre[] = [];

            try {
                // Parst die JSON-Strings
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
        // Dieser Fehler fängt den 'prepareAsync' Fehler ab, der ursprünglich aufgetreten ist.
        console.error('Error fetching favorite games:', error);
        return [];
    }
}