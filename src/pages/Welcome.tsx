import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Pressable, Text, View, Button, Alert } from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function Welcome({navigation}: ScreenProps) {
  const toStart = useCallback(() => {
    navigation.navigate('Start');
  }, [navigation]);
  return (
    <>
      <View>
        <Text>CWS-IDLE 환영합니다!</Text>
        <Button title="Start" onPress={toStart} />
      </View>
    </>
  );
}

export default Welcome;
