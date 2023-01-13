import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Pressable, Text, View, Button} from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUp',
  'Login'
>;

function Start({navigation}: ScreenProps) {
  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);
  return (
    <>
      <View>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <Text>or</Text>
        <Button title="Create Account" onPress={toSignUp} />
      </View>
    </>
  );
}

export default Start;
