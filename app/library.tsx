import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from 'react-native-vector-icons';
import styles from './Style';

const LibraryScreen = () => {
  const [library, setLibrary] = useState([
    {
      id: '1',
      title: 'The Witcher 3: Wild Hunt',
      releaseDate: '2015/05/18',
      ageRating: 'Mature 17+',
      genre: 'Action-RPG',
      platform: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X/S', 'Switch'],
      metacritic: 92,
      averagePlaytime: '43 hours',
    },
    {
      id: '2',
      title: 'Elden Ring',
      releaseDate: '2022/02/22',
      ageRating: 'Mature 17+',
      genre: 'Action-RPG',
      platform: ['PC', 'PlayStation 4', 'PlayStation 5', 'Xbox One', 'Xbox Series X/S', 'Switch'],
      metacritic: 95,
      averagePlaytime: '62 hours',
    },
  ]);

  const removeGame = (id: string) => {
    setLibrary(library.filter((game) => game.id !== id));
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>My Game Library</Text>
      </View>
      <FlatList
        data={library}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gameItem}>
            <View style={styles.gameDetails}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.metaText}>Release Date: {item.releaseDate}</Text>
              <Text style={styles.metaText}>Age Rating: {item.ageRating}</Text> {/* Updated label */}
              <Text style={styles.metaText}>Genre: {item.genre}</Text>
              <Text style={styles.metaText}>Metacritic: {item.metacritic}</Text>
              <Text style={styles.metaText}>Average Playtime: {item.averagePlaytime}</Text>

              <Text style={styles.platformText}>Available on:</Text>
              <View style={styles.platformContainer}>
                {item.platform.includes('PC') && (
                  <View style={styles.platformItem}>
                    <FontAwesome name="windows" size={24} color="#000" style={styles.platformIcon} />
                    <Text style={styles.platformName}>PC</Text>
                  </View>
                )}
                {(item.platform.includes('PlayStation 4') || item.platform.includes('PlayStation 5')) && (
                  <View style={styles.platformItem}>
                    <MaterialCommunityIcons name="sony-playstation" size={24} color="#000" style={styles.platformIcon} />
                    <Text style={styles.platformName}>PS4/PS5</Text>
                  </View>
                )}
                {(item.platform.includes('Xbox One') || item.platform.includes('Xbox Series X/S')) && (
                  <View style={styles.platformItem}>
                    <MaterialCommunityIcons name="microsoft-xbox" size={24} color="#000" style={styles.platformIcon} />
                    <Text style={styles.platformName}>Xbox One/Series X/S</Text>
                  </View>
                )}
                {item.platform.includes('Switch') && (
                  <View style={styles.platformItem}>
                    <MaterialCommunityIcons name="nintendo-switch" size={24} color="#000" style={styles.platformIcon} />
                    <Text style={styles.platformName}>Switch</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeGame(item.id)}
            >
              <Text style={styles.listButtonTextStyle}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default LibraryScreen;
