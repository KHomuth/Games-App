// app/search.tsx

import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, TextInput, Image, View } from 'react-native';

// Diese Komponente zeigt die Suchfunktion an, zurzeit besteht die Seite nur aus dem Text "Search Page", das zentriert dargestellt wird.
export default function Search() {
  const [data, setData] = useState<any>([]);

  const searchAPI = async (text: string) => {
    // API Request URL = baseURL+filter+apikey+query
    const baseURL = 'https://api.rawg.io/api/';
    const apikey = '';
    let filter = 'games?';
    let query = `&search=\'name: ${text.toLocaleLowerCase()}\'`;

    if (text.length >= 2) {
      setTimeout(async () => {
        try {
          const response = await fetch(
            baseURL + filter + apikey + query,
          );
          const json = await response.json();
          if (json) {
            setData(json.results);
          }
        } catch (error) {
          console.error(error);
        }
      }, 500);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.input}
        placeholder='Search'
        onChangeText={(text) => searchAPI(text)}
      />

      {
        data.length?
        <SafeAreaView>
          <FlatList 
            data={data}
            renderItem={({ item }) => 
              <View style={styles.card}>
                <View style={styles.col}>
                  <Text style={styles.headline}>{item.name}</Text>
                   <Text>{item.released?item.released.split('-').reverse().join('.'):'-'}</Text> 
                  <FlatList
                    data={item.platforms}
                    renderItem={({ item })=>
                      <Text>{item.platform.name}</Text>
                    }
                  />
                </View>
              </View>
            }
            keyExtractor={(item) => item.id}
          />
        </SafeAreaView>:null
      }
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
    margin: 15
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingLeft: 10
  },
  headline: {
    fontWeight: 'bold',
    fontSize: 18
  }
});