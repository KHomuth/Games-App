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

    if (searchMode === 'platform') {
      query = `&platforms=${formatToSlug(term)}`;
    } else if (searchMode === 'genre') {
      query = `&genres=${formatToSlug(term)}`;
    } else {
      query = `&search=${term.toLowerCase().trim()}`;
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
