import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Button, Text, View} from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'EmailSignUp'>;

function SignUp({navigation}: ScreenProps) {
  const toEmailSignUp = useCallback(() => {
    navigation.navigate('EmailSignUp');
  }, [navigation]);
  return (
    <>
      <View>
        <Text>회원가입하기</Text>
        <Text>소셜 로그인 및 이메일로 가입하기</Text>
      </View>
      <View>
        <Button title="네이버로 시작하기" />
        <Button title="구글로 시작하기" />
      </View>
      <View>
        <Button title="이메일로 가입하기" onPress={toEmailSignUp} />
      </View>
    </>
  );
}
export default SignUp;
