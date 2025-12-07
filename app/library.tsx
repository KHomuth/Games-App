import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './Style';
// WICHTIG: Importiere initializeDatabase und removeFavoriteGame
import { getFavoriteGames, initializeDatabase, removeFavoriteGame, LibraryItem} from './../db/Database'; 


// Die Interface-Definition kann nun aus der Database-Datei importiert werden.

const LibraryScreen = () => {
  const [library, setLibrary] = useState<LibraryItem[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  // Datenbank initialisieren und Spiele laden
  const loadGames = async () => {
    setIsLoading(true);
    try {
      // SCHRITT 1: Initialisierung sicherstellen, bevor gelesen wird
      const initSuccess = await initializeDatabase();
      if (!initSuccess) {
        console.error("Datenbankinitialisierung fehlgeschlagen.");
        // Falls die Initialisierung fehlschlägt, den Ladevorgang beenden
        return; 
      }

      // SCHRITT 2: Favoriten laden (wird erst nach erfolgreicher Initialisierung ausgeführt)
      const games = await getFavoriteGames(); 
      setLibrary(games);
    } catch (error) {
      console.error("Fehler beim Laden der Favoriten:", error);
      // Zeigt dem Benutzer, dass etwas schiefgelaufen ist.
      Alert.alert("Fehler", "Die Lieblingsspiele konnten nicht geladen werden.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Ruft die Initialisierung und das Laden beim Komponenten-Mount auf
    loadGames();
  }, []);

  // Funktion zum Löschen eines Spiels aus der Datenbank
  const handleRemoveGame = (gameId: string, gameName: string) => {
    Alert.alert(
      "Spiel entfernen",
      `Möchtest du "${gameName}" wirklich aus deiner Bibliothek entfernen?`,
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Entfernen",
          onPress: async () => {
            // Ruft die Datenbankfunktion zum Löschen auf
            const success = await removeFavoriteGame(gameName);
            
            if (success) {
              // Aktualisiert den Zustand nur, wenn die DB-Operation erfolgreich war
              setLibrary(library.filter((game) => game.id !== gameId));
              Alert.alert('Erfolg', `"${gameName}" wurde entfernt.`);
            } else {
              Alert.alert('Fehler', `Konnte "${gameName}" nicht aus der Datenbank entfernen.`);
            }
          },
          style: "destructive"
        }
      ]
    );
  };


  if (isLoading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Spiele werden geladen...</Text>
      </View>
    );
  }

  // Fall: Keine Spiele gefunden
  if (library.length === 0 && !isLoading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.titleText}>My Game Library</Text>
        <Text style={{ marginTop: 20 }}>Du hast noch keine Lieblingsspiele hinzugefügt.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>My Game Library</Text>
      </View>
      <FlatList
        data={library}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gameItem}>
            <View style={styles.gameDetails}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              
              <Text style={styles.metaText}>Release Date: {item.releaseDate}</Text>
              
              <Text style={styles.metaText}>Genre: {item.genre}</Text>
              
              <Text style={styles.metaText}>Metacritic: {item.metacritic}</Text> 

              <Text style={styles.platformText}>Available on:</Text>
              <View style={styles.platformContainer}>

                {item.platform.includes('PC') && (
                  <View style={styles.platformItem}>
                    <FontAwesome name="windows" size={24} color="#000" style={styles.platformIcon} />
                    <Text style={styles.platformName}>PC</Text>
                  </View>
                )}

                {(item.platform.includes('PlayStation 4') || item.platform.includes('PlayStation 5')) && (
                  <View style={styles.platformItem}>
                    <MaterialCommunityIcons name="sony-playstation" size={24} color="#000" style={styles.platformIcon} />
                    <Text style={styles.platformName}>PS4/PS5</Text>
                  </View>
                )}

                {(item.platform.includes('Xbox One') || item.platform.includes('Xbox Series X/S')) && (
                   <View style={styles.platformItem}>
                     <MaterialCommunityIcons name="microsoft-xbox" size={24} color="#000" style={styles.platformIcon} />
                     <Text style={styles.platformName}>Xbox One/Series X/S</Text>
                   </View>
                 )}
                
              </View>
            </View>

            <TouchableOpacity 
                style={styles.removeButton} 
                // AUFRUF DER NEUEN LÖSCH-FUNKTION
                onPress={() => handleRemoveGame(item.id, item.title)}
            >
              <Text style={styles.listButtonTextStyle}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default LibraryScreen;