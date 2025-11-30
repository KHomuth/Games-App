import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, TextInput, Image, View, Button } from 'react-native';

type PlatformData = {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
};

type Genre = {
  id: number;
  name: string;
  slug: string;
};

type Game = {
  id: number;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  metacritic: number;
  platforms: PlatformData[];
  genres: Genre[];
};

type SearchMode = 'platform' | 'genre' | 'gameName';

const PLATFORM_NAME_TO_ID: { [key: string]: number } = {
  // PC
  pc: 4,
  computer: 4,
  steam: 4,

  // PlayStation 4
  ps4: 18,
  'ps 4': 18,
  'playstation 4': 18,
  'playstation-4': 18,

  // PlayStation 5
  ps5: 187,
  'ps 5': 187,
  'playstation 5': 187,
  'playstation-5': 187,

  // Xbox One
  'xbox one': 1,
  'xbox-one': 1,
  xone: 1,

  // Xbox Series X/S
  'xbox series x': 186,
  'xbox series s': 186,
  'xbox series': 186,
  'series x': 186,
  'series s': 186,

  // Nintendo Switch
  switch: 7,
  'nintendo switch': 7,
  'nintendo-switch': 7,
};

const GENRE_NAME_TO_SLUG: { [key: string]: string } = {
  action: 'action',
  indie: 'indie',
  adventure: 'adventure',

  // RPG
  rpg: 'role-playing-games-rpg',
  'role playing': 'role-playing-games-rpg',
  'role-playing': 'role-playing-games-rpg',

  // Shooter
  shooter: 'shooter',
  shooters: 'shooter',
  fps: 'shooter',

  // MMO / MMORPG
  mmo: 'massively-multiplayer',
  mmorpg: 'massively-multiplayer',
  'massively multiplayer': 'massively-multiplayer',

  // Weitere Standard-Genres
  strategy: 'strategy',
  casual: 'casual',
  simulation: 'simulation',
  puzzle: 'puzzle',
  arcade: 'arcade',
  platformer: 'platformer',
  racing: 'racing',
  sports: 'sports',
  fighting: 'fighting',
  family: 'family',
  'board games': 'board-games',
  educational: 'educational',
  card: 'card',
};





export default function Search() {
  const [data, setData] = useState<Game[]>([]);
  const [searchMode, setSearchMode] = useState<SearchMode>('gameName');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const formatToSlug = (text: string) => 
    text.toLowerCase().trim().replace(/\s+/g, '-');

  const searchAPI = (term: string): void => {
    const baseURL = 'https://api.rawg.io/api/';
    const apikey = `key=${process.env.EXPO_PUBLIC_API_KEY}`;
    let filter = 'games?';
    let query = '';

    const normalizedTerm = term.toLowerCase().trim();

    if (!normalizedTerm) {
        setData([]);
        return;
    }
    if (searchMode === 'platform') {
        const platformId = PLATFORM_NAME_TO_ID[normalizedTerm];

        if (!platformId) {
            console.warn('Unknown platform input:', normalizedTerm);
            setData([]);
            return;
        }

        query = `&platforms=${platformId}`;
    } else if (searchMode === 'genre') {
      const mappedSlug = GENRE_NAME_TO_SLUG[normalizedTerm];
      const genreSlug = mappedSlug ? mappedSlug : formatToSlug(term);

      query = `&genres=${genreSlug}`;
    } else {
      query = `&search=${normalizedTerm}`;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(baseURL + filter + apikey + query);
        const json = await response.json();
        if (json && json.results) {
          setData(json.results);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }, 500);
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    searchAPI(text);
  };

  const handleSwitchSearchMode = (mode: SearchMode) => {
    setSearchMode(mode);
    setSearchTerm('');
    setData([]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.buttonContainer}>
        <Button title="Search by Game Name" onPress={() => handleSwitchSearchMode('gameName')} />
        <Button title="Search by Platform" onPress={() => handleSwitchSearchMode('platform')} />
        <Button title="Search by Genre" onPress={() => handleSwitchSearchMode('genre')} />
      </View>

      <TextInput
        style={styles.input}
        placeholder={`Search by ${searchMode}`}
        onChangeText={handleSearchChange}
        value={searchTerm}
      />

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
        ) : data.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No results found.</Text>
        ) : (
        <SafeAreaView>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: Game }) => (
              <View style={styles.card}>
                <View style={styles.col}>
                  <Image style={styles.image} source={{ uri: item.background_image }} />
                  <Text style={styles.headline}>{item.name}</Text>
                  <Text>
                    {item.released ? item.released.split('-').reverse().join('.') : '-'}
                    {item.tba ? ' - not yet released' : ''}
                  </Text>
                  <Text>Metacritic: {item.metacritic ? item.metacritic : '-'}</Text>
                  <Text>Platforms: {item.platforms?.map((p) => p.platform.name).join(', ')}</Text>
                  <Text>Genres: {item.genres?.map((g) => g.name).join(', ')}</Text>
                </View>
              </View>
            )}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: '#373f43',
    color: 'white',
    margin: 15,
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingLeft: 10,
  },
  headline: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
});
