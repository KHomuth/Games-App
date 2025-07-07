import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import styles from './Style';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [fontsLoaded] = useFonts({
    Orbitron: require('../assets/fonts/Orbitron-Regular.ttf'),
    OrbitronExtraBold: require('../assets/fonts/Orbitron-ExtraBold.ttf'),
  });

  const navigation = useNavigation<any>();

  const handleSearchPress = () => {
    navigation.navigate('Search');
  };

  const handleLibraryPress = () => {
    navigation.navigate('Library');
  };

  const handleLoginRegisterPress = () => {
    navigation.navigate('Login');
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.mainContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Games DB App!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.customButtonStyle} onPress={handleSearchPress}>
          <Ionicons name="search" size={styles.iconStyle.size} color={styles.iconStyle.color} />
          <Text style={styles.customButtonTextStyle}>Search Game</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customButtonStyle} onPress={handleLibraryPress}>
          <Ionicons name="library" size={styles.iconStyle.size} color={styles.iconStyle.color} />
          <Text style={styles.customButtonTextStyle}>Your Library</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customButtonStyle} onPress={handleLoginRegisterPress}>
          <Ionicons name="log-in" size={styles.iconStyle.size} color={styles.iconStyle.color} />
          <Text style={styles.customButtonTextStyle}>Login / Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}