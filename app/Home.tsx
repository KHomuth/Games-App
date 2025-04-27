import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import styles from './Style';  // Alle Styles importieren
import { useNavigation } from '@react-navigation/native'; // Importiere useNavigation

export default function Home() {
  const [fontsLoaded] = useFonts({
    Orbitron: require('../assets/fonts/Orbitron-Regular.ttf'),  // Schriftart laden
    OrbitronExtraBold: require('../assets/fonts/Orbitron-ExtraBold.ttf'),
  });

  const navigation = useNavigation(); // useNavigation Hook für die Navigation

  const handleSearchPress = () => {
    navigation.navigate('Search'); // Navigiere zu 'Search' Screen
  };

  const handleLibraryPress = () => {
    navigation.navigate('Library'); // Navigiere zu 'Library' Screen
  };

  const handleLoginRegisterPress = () => {
    navigation.navigate('Login'); // Navigiere zu 'Login' Screen
  };

  if (!fontsLoaded) {
    return null; // Warten, bis die Schriftart geladen ist
  }

  return (
    <View style={styles.mainContainer}>
      {/* Container für den Titel */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Games DB App!</Text>
      </View>

      {/* Container für die Buttons */}
      <View style={styles.buttonContainer}>
        {/* Button für die Games-Suche */}
        <TouchableOpacity style={styles.customButtonStyle} onPress={handleSearchPress}>
          <Ionicons name="search" size={styles.iconStyle.size} color={styles.iconStyle.color} />
          <Text style={styles.customButtonTextStyle}>Search Game</Text>
        </TouchableOpacity>

        {/* Button für die Bibliothek */}
        <TouchableOpacity style={styles.customButtonStyle} onPress={handleLibraryPress}>
          <Ionicons name="library" size={styles.iconStyle.size} color={styles.iconStyle.color} />
          <Text style={styles.customButtonTextStyle}>Your Library</Text>
        </TouchableOpacity>

        {/* Button für Login/Registrierung */}
        <TouchableOpacity style={styles.customButtonStyle} onPress={handleLoginRegisterPress}>
          <Ionicons name="log-in" size={styles.iconStyle.size} color={styles.iconStyle.color} />
          <Text style={styles.customButtonTextStyle}>Login / Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
