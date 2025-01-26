// app/login.tsx

import React, { useState } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  // Zustände für die Eingabefelder und den Registrierungsstatus
  const [email, setEmail] = useState(''); // Zustand für die E-Mail-Adresse
  const [password, setPassword] = useState(''); // Zustand für das Passwort
  const [isRegistering, setIsRegistering] = useState(false); // Zustand zum Umschalten zwischen Login und Registrierung
  const router = useRouter(); // Router-Instanz für die Navigation

  // Funktion für den Login-Prozess
  const handleLogin = () => {
    if (email && password) {
      // Bei erfolgreichem Login weiter zur Dashboard-Seite
      router.push('/Dashboard');
    } else {
      // Fehlermeldung bei ungültigen Anmeldedaten
      alert('Please enter valid credentials');
    }
  };

  // Funktion für den Registrierungsprozess
  const handleRegister = () => {
    if (email && password) {
      // Erfolgreiche Registrierung
      alert('Registration successful!');
      router.push('/Dashboard'); // Weiterleitung nach erfolgreicher Registrierung
    } else {
      // Fehlermeldung bei ungültigen Anmeldedaten
      alert('Please enter valid credentials');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {/* Anzeige des Textes: Login oder Registrierung je nach Zustand */}
      <Text>{isRegistering ? 'Register' : 'Login'}</Text>

      {/* Eingabefeld für die E-Mail-Adresse */}
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          width: '100%',
          paddingLeft: 10,
        }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail} // Setzt den Zustand für die E-Mail
      />

      {/* Eingabefeld für das Passwort */}
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          width: '100%',
          paddingLeft: 10,
        }}
        placeholder="Password"
        secureTextEntry // Verhindert die Anzeige des Passworts
        value={password}
        onChangeText={setPassword} // Setzt den Zustand für das Passwort
      />

      {/* Button für den Login oder die Registrierung */}
      <Button
        title={isRegistering ? 'Register' : 'Log In'} // Text des Buttons basierend auf dem Zustand
        onPress={isRegistering ? handleRegister : handleLogin} // Ruft die entsprechende Funktion auf
      />

      <View style={{ marginTop: 10 }}>
        {/* Button für das Umschalten zwischen Login und Registrierung */}
        <Button
          title={isRegistering ? 'Already have an account? Log In' : 'Don\'t have an account? Register'}
          onPress={() => setIsRegistering(!isRegistering)} // Wechselt den Zustand für Registrierung/Login
        />
      </View>
    </View>
  );
}
