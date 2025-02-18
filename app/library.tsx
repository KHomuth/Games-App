// app/library.tsx

import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './Style';  // Alle Styles importieren

export default function Library() {
  const navigation = useNavigation(); // useNavigation Hook für die Navigation
  const handleBackPress = () => {
    navigation.goBack(); // Navigiere zurück zum vorherigen Screen
  };

  return (
    <View style={styles.mainContainer}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your library</Text>
        </View>

        {/* Button, um zurück zum vorherigen Screen zu navigieren */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.customButtonStyle} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={styles.iconStyle.size} color={styles.iconStyle.color} />
                <Text style={styles.customButtonTextStyle}>Go Back</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}
