// app/search.tsx

import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

// Diese Komponente zeigt die Suchfunktion an, zurzeit besteht die Seite nur aus dem Text "Search Page", das zentriert dargestellt wird.
export default function Search() {
  const searchAPI = (text: any) => {
    console.warn(text);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder='Search'
        onChange={(text) => searchAPI(text)}
      />
    </View>
  );
}
