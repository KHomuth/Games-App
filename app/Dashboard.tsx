//app/Dashboard.tsx

import React from 'react';
import { Alert } from 'react-native'; // Importiert die Alert-Komponente
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Verwende useNavigation Hook
import styles from './Style';  // Alle Styles importieren

export default function Dashboard() {
  const navigation = useNavigation(); // useNavigation für die Navigation

  // Funktion für den "Search" Button
  const handleSearchPress = () => {
    navigation.navigate('Search'); // Navigiere zur Seite 'Search'
  };

  // Funktion für den "Library" Button
  const handleLibraryPress = () => {
    navigation.navigate('Library'); // Navigiere zur Seite 'Library'
  };

  // Funktion für den "My Account" Button
  const handleAccountPress = () => {
    navigation.navigate('MyAccount'); // Navigiere zur Seite 'MyAccount'
  };

  // Funktion für den "Logout" Button
  const handleLogoutPress = () => {
    navigation.navigate('Home'); // Navigiere zur Seite 'Home' (Logout)

    // Zeige das Alert nach einer kurzen Verzögerung (z.B. 500ms)
    setTimeout(() => {
        Alert.alert(
            'You have been successfully logged out.',  // Nachricht des Alerts
        );
    }, 500);  // Verzögerung in Millisekunden, hier 500ms
  };

  return (
    <View style={styles.mainContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Welcome to your Game Library!</Text>
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

            {/* Button für MyAccount */}
            <TouchableOpacity style={styles.customButtonStyle} onPress={handleAccountPress}>
                <Ionicons name="person" size={styles.iconStyle.size} color={styles.iconStyle.color} />
                <Text style={styles.customButtonTextStyle}>My Account</Text>
            </TouchableOpacity>

            {/* Button für Log out */}
            <TouchableOpacity style={styles.customButtonStyle} onPress={handleLogoutPress}>
                <Ionicons name="log-out" size={styles.iconStyle.size} color={styles.iconStyle.color} />
                <Text style={styles.customButtonTextStyle}>Log out</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}
