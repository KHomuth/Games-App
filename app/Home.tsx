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

      {/* Button f�r die Games-Suche */}
      <Button title="Search game" onPress={handleSearchPress} />

      {/* Button f�r die Bibliothek (mit Aufforderung zur Anmeldung) */}
      <Button title="Your library (Login required)" onPress={handleLibraryPress} />

      {/* Button f�r den Login/Registrierung (falls noch kein Konto) */}
      <View style={{ marginTop: 30 }}>
        <Button title="Login / Register" onPress={handleLoginRegisterPress} />
      </View>
    </View>
  );
}
