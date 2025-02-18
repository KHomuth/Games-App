// app/search.tsx

import React from 'react';
import { Text, View } from 'react-native';

// Diese Komponente zeigt die Suchfunktion an, zurzeit besteht die Seite nur aus dem Text "Search Page", das zentriert dargestellt wird.
export default function Search() {
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Search Page</Text>
    </View>
  );
}
