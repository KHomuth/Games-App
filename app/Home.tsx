import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  // Lade die Orbitron-Schriftart
  const [fontsLoaded] = useFonts({
    Orbitron: require('../assets/fonts/Orbitron-Regular.ttf'),  // Pfad zur Schriftart
  });

  const router = useRouter();

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleLibraryPress = () => {
    router.push('/login');
  };

  const handleLoginRegisterPress = () => {
    router.push('/login');
  };

  // Warte darauf, dass die Schriftart geladen wird
  if (!fontsLoaded) {
    return null; // Warten, bis die Schriftart geladen ist
  }

  // Button-Style für benutzerdefinierte Buttons
  const customButtonStyle = {
    backgroundColor: '#1a237e',  // Dunkelblaue Buttonfarbe
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
    shadowColor: '#606060', // Dunkelgrauer Schatten (auf dem grauen Hintergrund nicht zu erkennen, daher erstmal placeholder)
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    marginBottom: 50,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  };

  // Text-Style für den Button
  const customTextStyle = {
    color: 'white',  // Weiße Schriftfarbe
    fontSize: 33,
    fontWeight: 'bold',
    marginLeft: 10,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#e0e0e0' }}>
      {/* Container für den Titel, oben ausgerichtet; 
          dunkelblaue Farbe für den gesamten Hintergrund */}
      <View style={{ paddingTop: 50, alignItems: 'center' }}>
        <Text style={{
          fontFamily: 'Orbitron, "Times New Roman", sans-serif',
          fontSize: 42,
          fontWeight: 'bold',
          color: '#1a237e',
          textShadowColor: '#000',
          textShadowOffset: { width: 1, height: 3 },
          textShadowRadius: 5,
        }}>
          Games DB App!
        </Text>
      </View>

      {/* Container für die Buttons, zentriert */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 0 }}>
        {/* Benutzerdefinierter Button für die Games-Suche */}
        <TouchableOpacity style={customButtonStyle} onPress={handleSearchPress}>
          <Ionicons name="search" size={33} color="white" />
          <Text style={customTextStyle}>Search Game</Text>
        </TouchableOpacity>

        {/* Benutzerdefinierter Button für die Bibliothek */}
        <TouchableOpacity style={customButtonStyle} onPress={handleLibraryPress}>
          <Ionicons name="library" size={33} color="white" />
          <Text style={customTextStyle}>Your Library</Text>
        </TouchableOpacity>

        {/* Benutzerdefinierter Button für den Login/Registrierungs-Button */}
        <TouchableOpacity style={customButtonStyle} onPress={handleLoginRegisterPress}>
          <Ionicons name="log-in" size={33} color="white" />
          <Text style={customTextStyle}>Login / Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
