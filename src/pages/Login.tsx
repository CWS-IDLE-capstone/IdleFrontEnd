import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import SignTextInput from '../components/signTextInput';
import {
  Pressable,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import { LoggedInParamList } from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import DaonBtn from '../components/daonBtn';
import Hyperlink from 'react-native-hyperlink';
import openURL from '../../openUrl';
import {Linking} from 'react-native';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useNavigation} from '@react-navigation/native';

type ScreenProps = NativeStackScreenProps<RootStackParamList,'NaverLogin', 'SignUp'>;

function Login({navigation}: ScreenProps) {
  // const toMain = () => {
  //   setIsLoggedIn(true);
  // };
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null); //generic
  const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback(text => {
    setEmail(text);
  }, []);

  const onChangePassword = useCallback(text => {
    setPassword(text);
  }, []);

  const onSubmit = useCallback(async () => {
    // const toMain = useCallback(async () => {
    if (!email || !email.trim()) {
      //trim()은 좌우 공백을 없애줌 만약 한칸 공백일때 입력되는것을 방지하기 위해
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    try {
      const response = await axios.post(`${Config.API_URL}/api/user/login`, {
        email,
        password,
      });
      console.log(response.data);
      Alert.alert('알림', '로그인 되었습니다.');
      dispatch(
        //리덕스에 넣어주기
        userSlice.actions.setUser({
          //TODO 서버에서 무엇을 데이터로 줄지 알아봐야됨 현재는 name, email, accessToken, refreshToken
          name: response.data.name,
          email: response.data.email,
          accessToken: response.data.accessToken, // 유효기간 10분, 5분, 1시간
        }),
      );
      // await EncryptedStorage.setItem(
      //   'refreshToken',
      //   response.data.data.refreshToken,
      // );
      // navigation.navigate('Main'); //성공했을시 메인으로 이동
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    } finally {
    }
  }, [dispatch, email, navigation, password]);

  return (
    <View style={styles.header}>
      <ImageBackground
        source={require('../assets/bg1.jpg')}
        style={styles.bgImage}>
        <View style={{flex: 2}}>
          <Text style={styles.login}>Login</Text>
          <TextInput
            style={styles.Input}
            placeholder="Email"
            value={email}
            onChangeText={onChangeEmail}
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            keyboardType="email-address"
            onSubmitEditing={() => {
              //엔터쳤을때 무슨 동작을 할건지
              passwordRef.current?.focus();
            }}
            blurOnSubmit={false} //키보드 내려가는거 막아줌
            ref={emailRef}
          />
          <TextInput
            style={styles.Input}
            placeholder="Password"
            value={password}
            onChangeText={onChangePassword}
            secureTextEntry
            importantForAutofill="yes"
            autoComplete="password"
            textContentType="password"
            ref={passwordRef}
            onSubmitEditing={onSubmit}
          />
          <DaonBtn
            text="Login"
            style={styles.gangstyle}
            activeOpacity={0.5}
            onPress={onSubmit}
          />
          <DaonBtn
            text="LoginUserOnSubmitTest"
            style={styles.gangstyle}
            activeOpacity={0.5}
            onPress={onSubmit}
          />
        </View>

        <View style={{flex: 1}}>
          <View>
            <TouchableOpacity style={styles.row}>
              <Text
                style={styles.naverLogin}
                onPress={() => navigation.navigate('NaverLogin')}>
                네이버 로그인
              </Text>
            </TouchableOpacity>
            {/* <Text style={styles.kakaoLogin}>카카오 로그인</Text> */}
            <Pressable>
              <Text
                style={styles.lastline}
                onPress={() => navigation.navigate('SignUp')}>
                Don't have account?{' '}
                <Text style={{color: '#6A74CF'}}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const {width: WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 50,
    justifyContent: 'space-around',
  },
  header: {flex: 1},
  bgImage: {width: '100%', height: '100%'},

  naverLogin: {
    alignSelf: 'flex-start',
    marginTop: 30,
    marginBottom: 5,
    backgroundColor: '#03C75A',
    width: 150,
    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 77,
  },

  kakaoLogin: {
    alignSelf: 'flex-end',
    marginTop: 30,
    marginBottom: 5,
    backgroundColor: 'orange',
    width: 150,
    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 77,
  },

  login: {
    marginTop: 70,
    fontSize: 30,
    color: 'white',
    alignSelf: 'center',
  },

  Input: {
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    width: WIDTH * 0.7,
    height: 40,
    color: 'black',
    textAlign: 'left',
    textAlignVertical: 'center',
    borderRadius: 77,
  },
  gangstyle: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 5,
    backgroundColor: '#6A74CF',
    width: WIDTH * 0.7,
    height: 40,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 77,
  },
  lastline: {
    alignSelf: 'center',
    marginTop: 40,
  },
  container: {
    flex: 0.7,
    borderBottomWidth: 1,
    borderBottomColor: '#778899',
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 50,
  },
});

export default Login;
