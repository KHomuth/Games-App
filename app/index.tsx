import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens'; // Importiere enableScreens

// Importiere die Bildschirmkomponenten
import Home from './Home';
import Library from './library';
import Search from './search';
import Login from './login';
import Dashboard from './Dashboard'; // Importiere Dashboard

// `enableScreens` vor der Navigation aufrufen
enableScreens(); // Aktiviert die native Bildschirmoptimierung

// Stack Navigator erstellen
const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Library" component={Library} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
  );
}
