// app/search.tsx

import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, SafeAreaView } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './Style';

export default function Search() {
  const [data, setData] = useState<any[]>([]);

  const searchAPI = (text: string) => {
    const baseURL = 'https://api.rawg.io/api/';
    const apikey = `key=${process.env.EXPO_PUBLIC_API_KEY}`;
    let filter = 'games?';
    let query = `&search=${encodeURIComponent(text.toLowerCase())}`;

    if (text.length >= 2) {
      setTimeout(async () => {
        try {
          const response = await fetch(baseURL + filter + apikey + query);
          const json = await response.json();
          if (json) {
            setData(json.results);
          }
        } catch (error) {
          console.error(error);
        }
      }, 500);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Search"
        onChangeText={searchAPI}
        clearButtonMode="while-editing"
      />

      {data.length > 0 && (
        <SafeAreaView>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              // Umwandeln der Plattformnamen aus API in ein einfaches Array
              const platforms = item.platforms?.map((p: any) => p.platform.name) || [];

              return (
                <View style={styles.gameItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.gameTitle}>{item.name}</Text>
                    <Text style={styles.metaText}>
                      Release Date: {item.released ? item.released.split('-').reverse().join('.') : '-'}
                    </Text>
                    <View style={styles.platformIcons}>
                      {/* Plattform Icons */}
                      {platforms.includes('PC') && (
                        <View style={styles.platformItem}>
                          <FontAwesome name="windows" size={24} color="#000" />
                          <Text style={styles.platformText}>PC</Text>
                        </View>
                      )}

                      {(platforms.includes('PlayStation 4') || platforms.includes('PlayStation 5')) && (
                        <View style={styles.platformItem}>
                          <MaterialCommunityIcons name="sony-playstation" size={24} color="#000" />
                          <Text style={styles.platformText}>PS4/PS5</Text>
                        </View>
                      )}

                      {(platforms.includes('Xbox One') || platforms.includes('Xbox Series X/S')) && (
                        <View style={styles.platformItem}>
                          <MaterialCommunityIcons name="microsoft-xbox" size={24} color="#000" />
                          <Text style={styles.platformText}>Xbox</Text>
                        </View>
                      )}

                      {platforms.includes('Nintendo Switch') && (
                        <View style={styles.platformItem}>
                          <MaterialCommunityIcons name="nintendo-switch" size={24} color="#000" />
                          <Text style={styles.platformText}>Switch</Text>
                        </View>
                      )}

                      {platforms.includes('Nintendo 3DS') && (
                        <View style={styles.platformItem}>
                          <MaterialCommunityIcons name="gamepad-variant" size={24} color="#000" />
                          <Text style={styles.platformText}>3DS</Text>
                        </View>
                      )}

                      {platforms.includes('macOS') && (
                        <View style={styles.platformItem}>
                          <MaterialCommunityIcons name="apple" size={24} color="#000" />
                          <Text style={styles.platformText}>macOS</Text>
                        </View>
                      )}

                      {platforms.includes('iOS') && (
                        <View style={styles.platformItem}>
                          <MaterialCommunityIcons name="apple" size={24} color="#000" />
                          <Text style={styles.platformText}>iOS</Text>
                        </View>
                      )}

                      {platforms.includes('Android') && (
                        <View style={styles.platformItem}>
                          <MaterialCommunityIcons name="android" size={24} color="#000" />
                          <Text style={styles.platformText}>Android</Text>
                        </View>
                      )}

                      {platforms.includes('Linux') && (
                        <View style={styles.platformItem}>
                          <FontAwesome name="linux" size={24} color="#000" />
                          <Text style={styles.platformText}>Linux</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </SafeAreaView>
      )}
    </View>
  );
}
