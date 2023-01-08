import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'EmailSignUp'>;

function SignUp({navigation}: ScreenProps) {
  const toEmailSignUp = useCallback(() => {
    navigation.navigate('EmailSignUp');
  }, [navigation]);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.contain1}>
          <Text style={styles.mainText}>회원가입하기</Text>
          <Text style={styles.subText}>소셜 로그인 및 이메일로 가입하기</Text>
        </View>
        <View style={styles.contain2}>
          <Button color="green" title="네이버로 시작하기" />
          <Text />
          <Button title="구글로 시작하기" />
          <Button title="카카오로 시작하기" />
        </View>
        <View style={styles.contain3}>
          <TouchableOpacity activeOpacity={0.9} onPress={toEmailSignUp}>
            <Text style={styles.signText}>이메일로 시작하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
export default SignUp;

const styles = StyleSheet.create({
  container: {flex: 1},
  contain1: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#778899',
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  contain2: {
    flex: 1,
  },
  contain3: {
    flex: 1.6,
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#778899',
    borderStyle: 'dashed',
    paddingTop: 10,
  },
  mainText: {fontSize: 35, fontWeight: 'bold', color: 'black'},
  subText: {fontSize: 20, color: 'black'},
  signText: {
    backgroundColor: 'gray',
    width: '80%',
    height: 35,
    alignSelf: 'center',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 3,
  },
});
