// app/library.tsx

import React from 'react';
import { Text, View } from 'react-native';

// Diese Komponente zeigt die Benutzer - Bibliothek an, zurzeit besteht die Seite nur aus dem Text "Your library", das zentriert dargestellt wird.
export default function Library() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your library</Text>
    </View>
  );
}