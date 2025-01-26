// app/Home.tsx

import React from 'react';
import { Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  const handleSearchPress = () => {
    // Weiter zur Suchseite
    router.push('/search');
  };

  const handleLibraryPress = () => {
    // Wenn der Benutzer nicht eingeloggt ist, zur Login-Seite weiterleiten
    router.push('/login');
  };

  const handleLoginRegisterPress = () => {
    // Direkt zur Login/Registrierungs-Seite weiterleiten
    router.push('/login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 40 }}>Games DB App!</Text>

      {/* Button für die Games-Suche */}
      <Button title="Search game" onPress={handleSearchPress} />

      {/* Button für die Bibliothek (mit Aufforderung zur Anmeldung) */}
      <Button title="Your library (Login required)" onPress={handleLibraryPress} />

      {/* Button für den Login/Registrierung (falls noch kein Konto) */}
      <View style={{ marginTop: 30 }}>
        <Button title="Login / Register" onPress={handleLoginRegisterPress} />
      </View>
    </View>
  );
}
