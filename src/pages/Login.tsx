import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {
  Pressable,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function Login({navigation}: ScreenProps) {
  const toStart = useCallback(() => {
    navigation.navigate('Start');
  }, [navigation]);
  return (
    <>
      <View>
        <Text>Login</Text>
        <TextInput placeholder="Email" />
        <TextInput placeholder="Password" />

        <Button title="Login" onPress={toStart} />
        <Button title="구글 로그인" onPress={toStart} />
        <Button title="네이버 로그인" onPress={toStart} />
        <Button title="카카오 로그인" onPress={toStart} />

        <Pressable>
          <Text onPress={() => navigation.navigate('SignUp')}>
            Don't have account? Sign up
          </Text>
        </Pressable>
      </View>
    </>
  );
}

export default Login;
