import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Pressable, Text, View, Button, Alert, StyleSheet } from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function Main({navigation}: ScreenProps) {
  return (
    <>
      <View>
        <Text style = {{fontSize: 100}}>메인 화면</Text>
      </View>
    </>
  );
}

export default Main;
