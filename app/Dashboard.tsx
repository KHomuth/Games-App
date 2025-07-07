//app/Dashboard.tsx

import React from 'react';
import { Alert } from 'react-native'; // Importiert die Alert-Komponente
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Verwende useNavigation Hook
import styles from './Style';  // Alle Styles importieren

export default function Dashboard() {
  const navigation = useNavigation<any>(); // useNavigation f�r die Navigation

  // Funktion f�r den "Search" Button
  const handleSearchPress = () => {
    navigation.navigate('Search'); // Navigiere zur Seite 'Search'
  };

  // Funktion f�r den "Library" Button
  const handleLibraryPress = () => {
    navigation.navigate('Library'); // Navigiere zur Seite 'Library'
  };

  // Funktion f�r den "My Account" Button
  const handleAccountPress = () => {
    navigation.navigate('MyAccount'); // Navigiere zur Seite 'MyAccount'
  };

  // Funktion f�r den "Logout" Button
  const handleLogoutPress = () => {
    navigation.navigate('Home'); // Navigiere zur Seite 'Home' (Logout)

    // Zeige das Alert nach einer kurzen Verz�gerung (z.B. 500ms)
    setTimeout(() => {
        Alert.alert(
            'You have been successfully logged out.',  // Nachricht des Alerts
        );
    }, 500);  // Verz�gerung in Millisekunden, hier 500ms
  };

  return (
    <View style={styles.mainContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Welcome to your Game Library!</Text>
        </View>

        {/* Container f�r die Buttons */}
        <View style={styles.buttonContainer}>
            {/* Button f�r die Games-Suche */}
            <TouchableOpacity style={styles.customButtonStyle} onPress={handleSearchPress}>
                <Ionicons name="search" size={styles.iconStyle.size} color={styles.iconStyle.color} />
                <Text style={styles.customButtonTextStyle}>Search Game</Text>
            </TouchableOpacity>

            {/* Button f�r die Bibliothek */}
            <TouchableOpacity style={styles.customButtonStyle} onPress={handleLibraryPress}>
                <Ionicons name="library" size={styles.iconStyle.size} color={styles.iconStyle.color} />
                <Text style={styles.customButtonTextStyle}>Your Library</Text>
            </TouchableOpacity>

            {/* Button f�r MyAccount */}
            <TouchableOpacity style={styles.customButtonStyle} onPress={handleAccountPress}>
                <Ionicons name="person" size={styles.iconStyle.size} color={styles.iconStyle.color} />
                <Text style={styles.customButtonTextStyle}>My Account</Text>
            </TouchableOpacity>

            {/* Button f�r Log out */}
            <TouchableOpacity style={styles.customButtonStyle} onPress={handleLogoutPress}>
                <Ionicons name="log-out" size={styles.iconStyle.size} color={styles.iconStyle.color} />
                <Text style={styles.customButtonTextStyle}>Log out</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}
