//app/Dashboard.tsx

import React from 'react';
import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();


  // Funktion f�r den "Search" Button
  const handleSearchPress = () => {
    router.push('/search'); // Weiter zur Seite search
  };


  // Funktion f�r den "Library" Button
  const handleLibraryPress = () => {
    router.push('/library'); // Weiter zur Seite library
  };

  // Funktion f�r den "My Account" Button
  const handleAccountPress = () => {
    router.push('/myAccount'); // Weiter zur Seite myAccount
  };

  // Funktion f�r den "Logout" Button
  const handleLogoutPress = () => {
    router.push('/Home'); // Weiter zur Seite ohne Login
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 40 }}>Welcome to your Game Library!</Text>

      {/* Button f�r die Games-Suche */}
      <Button title="Search game" onPress={handleSearchPress} />

      {/* Abstand von 20 */}
      <View style={{ marginTop: 20 }} />

      {/* Button f�r die Bibliothek */}
      <Button title="Your Library" onPress={handleLibraryPress} />

      {/* Abstand von 20 */}
      <View style={{ marginTop: 20 }} />

      {/* Button f�r den Account */}
      <Button title="My Account" onPress={handleAccountPress} />

      {/* Abstand von 20 */}
      <View style={{ marginTop: 20 }} />

      {/* Button f�r Logout */}
      <Button title="Log Out" onPress={handleLogoutPress} style={{ marginTop: 20 }} />
    </View>
  );
}
