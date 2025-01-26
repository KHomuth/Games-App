// app/myAccount.tsx

import React from 'react';
import { Text, View } from 'react-native';

// Diese Komponente zeigt die MyAccount an, zurzeit besteht die Seite nur aus dem Text "My Account", das zentriert dargestellt wird.
export default function MyAccount() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>My Account</Text>
    </View>
  );
}