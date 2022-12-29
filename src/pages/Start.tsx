import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function Start({navigation}: ScreenProps) {
  const toSingUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);
  return (
    <>
      <View>
        <Text>login</Text>
        <Text>or</Text>
        <Pressable onPress={toSingUp}>
          <Text>CreateAccount</Text>
        </Pressable>
      </View>
    </>
  );
}

export default Start;
