import React, { useState } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Use Navigation Hook
import styles from './Style';  // Alle Styles importieren
import { registerUser } from './Database';


export default function Login() {
  // Zust�nde f�r die Eingabefelder und den Registrierungsstatus
  const [email, setEmail] = useState(''); // Zustand f�r die E-Mail-Adresse
  const [password, setPassword] = useState(''); // Zustand f�r das Passwort
  const [isRegistering, setIsRegistering] = useState(false); // Zustand zum Umschalten zwischen Login und Registrierung
  const navigation = useNavigation(); // useNavigation Hook f�r die Navigation

  // Funktion f�r den Login-Prozess
  const handleLogin = () => {
    if (email && password) {
      // Bei erfolgreichem Login weiter zur Dashboard-Seite
      navigation.navigate('Dashboard');
    } else {
      // Fehlermeldung bei ung�ltigen Anmeldedaten
      alert('Please enter valid credentials');
    }
  };

  // Funktion f�r den Registrierungsprozess
  const handleRegister = async () => {
    if (email && password) {
      const success = await registerUser(email, password); // replace 'Alice' with a name input if you want
      if (success) {
        alert('Registration successful!');
        navigation.navigate('Dashboard');
      } else {
        alert('Registration failed. Please try again.');
      }
    } else {
      alert('Please enter valid credentials');
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Anzeige des Textes: Login oder Registrierung je nach Zustand */}

        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{isRegistering ? 'Register' : 'Login'}</Text>
        </View>

      {/* Eingabefeld f�r die E-Mail-Adresse */}
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail} // Setzt den Zustand f�r die E-Mail
      />

      {/* Eingabefeld f�r das Passwort */}
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry // Verhindert die Anzeige des Passworts
        value={password}
        onChangeText={setPassword} // Setzt den Zustand f�r das Passwort
      />

      {/* Button f�r den Login oder die Registrierung */}
      <Button
        title={isRegistering ? 'Register' : 'Log In'} // Text des Buttons basierend auf dem Zustand
        onPress={isRegistering ? handleRegister : handleLogin} // Ruft die entsprechende Funktion auf
      />

      <View style={{ marginTop: 10 }}>
        {/* Button f�r das Umschalten zwischen Login und Registrierung */}
        <Button
          title={isRegistering ? 'Already have an account? Log In' : 'Don\'t have an account? Register'}
          onPress={() => setIsRegistering(!isRegistering)} // Wechselt den Zustand f�r Registrierung/Login
        />
      </View>
    </View>
  );
}
