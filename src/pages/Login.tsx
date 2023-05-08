import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import SignTextInput from '../components/signTextInput';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import {LoggedInParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import DaonBtn from '../components/daonBtn';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import DismissKeyboardView from '../components/DismissKeyboardView';
type ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NaverLogin',
  'SignUp'
>;
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

function Login({navigation}: ScreenProps) {
  // const toMain = () => {
  //   setIsLoggedIn(true);
  // };
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('WalkiPet_Idle@inu.ac.kr');
  const [password, setPassword] = useState('1234');
  // const emailRef = useRef<TextInput | null>(null); //generic
  // const passwordRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback(text => {
    setEmail(text);
  }, []);

  const onChangePassword = useCallback(text => {
    setPassword(text);
  }, []);

  const onSubmit = useCallback(async () => {
    console.log(email);
    console.log(password);
    console.log('전송시도');
    console.log('');
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
      console.log('로그인 되었습니다.');
      dispatch(
        //리덕스에 넣어주기
        userSlice.actions.setUser({
          //TODO 서버에서 무엇을 데이터로 줄지 알아봐야됨 현재는 name, email, accessToken, refreshToken
          name: response.data.name,
          email: response.data.email,
          accessToken: response.data.token, // 유효기간 10분, 5분, 1시간
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
        Alert.alert('알림', errorResponse.data.message + '로그인실패');
        console.log('로그인 실패.');
      }
    } finally {
    }
  }, [dispatch, email, password]);

  return (
    <DismissKeyboardView style={styles.keyboardView}>
      <View style={styles.container}>
        <View style={styles.container1}>
          <Text style={styles.headerText}>WalkiPet</Text>
          <Text style={styles.headerText2}>
            이웃과 강아지 산책을 위한 앱에 오신 것을 환영합니다
          </Text>
        </View>
        <View style={styles.container2}>
          <SignTextInput
            placeholder={'아이디'}
            onChangeText={onChangeEmail}
            onSubmitEditing={
              //엔터쳤을때 비밀번호에게 포커스
              // passwordRef.current?.focus()
              undefined
            }
            keyboardType="email-address"
            textContentType="emailAddress"
            secureTextEntry
            value={email}
            style={[
              styles.emailInput,
              {
                borderColor: email !== '' ? '#8AA2F8' : '#C4C4C4',
              },
            ]}
          />
          <SignTextInput
            placeholder={'비밀번호'}
            onChangeText={onChangePassword}
            onSubmitEditing={undefined}
            keyboardType={undefined}
            textContentType="password"
            secureTextEntry
            value={password}
            style={[
              styles.pwInput,
              {
                borderColor: password !== '' ? '#8AA2F8' : '#C4C4C4',
              },
            ]}
          />
          {/* <TextInput
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
          textContentType="emailAddress"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        /> */}
          <DaonBtn
            text="로그인"
            touchableStyle={styles.loginBtn}
            style={styles.loginBtn2}
            activeOpacity={0.6}
            onPress={onSubmit}
          />
        </View>
        <View style={styles.container3}>
          <View style={styles.socialLoginCon}>
            {/* <TouchableOpacity onPress={() => navigation.navigate('NaverLogin')}>
              <Image source={require('../assets/KakaoComponent.png')} />
              //소셜로그인 추가시
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.naverLogin}
              onPress={() => navigation.navigate('NaverLogin')}>
              <Image
                style={styles.naverLoginImg}
                source={require('../assets/NaverComponent.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.btmTextView}>
            <Text style={styles.btmText}>워키펫이 처음이신가요? </Text>
            <Pressable>
              <Text
                onPress={() => navigation.navigate('EmailSignUp')}
                style={styles.btmSignUpText}>
                회원가입
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    height: HEIGHT,
    flexDirection: 'column',
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  container1: {
    flex: 0.3,
  },
  container2: {
    flex: 0.6,
  },
  container3: {
    flex: 0.2,
    justifyContent: 'space-around',
  },
  headerText: {
    marginTop: HEIGHT * 0.1,
    fontSize: 50,
    // fontFamily: 'Blinker-SemiBold',
    fontFamily: 'Calistoga-Regular',
    // fontFamily: 'BM-HANNA-TTF-Regular',
    color: '#8AA2F8',
    alignSelf: 'center',
  },
  headerText2: {
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
    opacity: 0.5,
    alignSelf: 'center',
    marginTop: HEIGHT * 0.005,
  },
  emailInput: {
    marginTop: HEIGHT * 0.02,
    backgroundColor: '#E8E8E8',
    borderWidth: 0,
  },
  pwInput: {
    marginTop: 10,
    backgroundColor: '#E8E8E8',
    borderWidth: 0,
  },
  loginBtn: {
    marginTop: 50,
  },
  loginBtn2: {
    borderRadius: 12,
  },

  socialLoginCon: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly', //로그인이추가될경우
    justifyContent: 'center',
    // alignSelf: 'center',
  },
  naverLogin: {
    borderRadius: 80,
  },
  naverLoginImg: {
    width: WIDTH * 0.18,
    height: HEIGHT * 0.07,
    resizeMode: 'contain',
  },
  btmTextView: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  btmText: {
    color: 'black',
    opacity: 0.4,
    fontWeight: '600',
  },
  btmSignUpText: {
    textDecorationLine: 'underline',
    color: '#6A74CF',
  },
});

export default Login;
