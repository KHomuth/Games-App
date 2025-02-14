import React, { FC, ReactElement, useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Parse from 'parse/react-native';

export const UserLogIn: FC<{}> = ({}): ReactElement => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const doUserLogIn = async function (): Promise<boolean> {
    try {
      const loggedInUser = await Parse.User.logIn(username, password);
      Alert.alert(
        'Success!',
        `User ${loggedInUser.get('username')} has successfully signed in!`,
      );
      navigation.navigate('Home');
      return true;
    } catch (error) {
      Alert.alert('Error!', error.message);
      return false;
    }
  };

  return (
    <View>
      <View>
        <TextInput
          value={username}
          placeholder={'Username'}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize={'none'}
          keyboardType={'email-address'}
        />
        <TextInput
          value={password}
          placeholder={'Password'}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => doUserLogIn()}>
          <View>
            <Text>{'Sign in'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
