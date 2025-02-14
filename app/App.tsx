import React from 'react';
import { useRouter } from 'expo-router';1	

import 'react-native-gesture-handler';
import { Image, SafeAreaView, StatusBar, Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserRegistration } from './UserRegistration';
import { UserLogIn } from './UserLogin';

Parse.setAsyncStorage(AsyncStorage);
const PARSE_APPLICATION_ID: string = 'APPLICATION_ID';
const PARSE_HOST_URL: string = 'HOST_URL';
const PARSE_JAVASCRIPT_ID: string = 'JAVASCRIPT_ID';
Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_ID);
Parse.serverURL = PARSE_HOST_URL;

function UserRegistrationScreen() {
  return (
    <>
      <StatusBar />
      <SafeAreaView>
        <View>
          <Image
            source={require('./assets/logo-back4app.png')} // anderes Bild als Headerbild nehmen
          />
          <Text>
            <Text>
              {'Games & Platforms Library'}
            </Text>
            {' User registration'}
          </Text>
        </View>
        <UserRegistration />
      </SafeAreaView>
    </>
  );
}

function UserLogInScreen() {
  return (
    <>
      <StatusBar />
      <SafeAreaView>
       <View>
         <Image
            source={require('./assets/logo-back4app.png')}
          />
          <Text>
            <Text>
              {'React Native on Back4App - '}
            </Text>
            {' User login'}
          </Text>
        </View>
        <UserLogIn />
      </SafeAreaView>
    </>
  );
}

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="Login" component={UserLogInScreen} />
            <Stack.Screen name="Sign Up" component={UserRegistrationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
