import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import SignTextInput from '../components/signTextInput';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import SignBtn from '../components/signBtn';
import SignText from '../components/signText';
import DismissKeyboardView from '../components/DismissKeyboardView';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'FinishSignUp'>;
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

function EmailSignUp({navigation}: ScreenProps) {
  const [name, setName] = useState('');
  const [isCheckMan, setIsCheckMan] = useState<String>('0');
  const [sex, setSex] = useState<String>('');
  const [email, setEmail] = useState('');
  const [verifyNum, setVerifyNum] = useState('');
  const [verifyUserNum, setVerifyUserNum] = useState('');
  const [verify, setVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [checkPass, setCheckPass] = useState('');
  const [nickname, setNickname] = useState('');
  const [provider, setProvider] = useState('');
  const [providerId, setProviderId] = useState('');

  const onChangeName = (payload: React.SetStateAction<string>) => {
    setName(payload);
    setNickname(payload);
  };
  const onSubmitName = () => {
    Alert.alert(name);
    console.log(name);
  };
  const onCheckMan = () => {
    setIsCheckMan('1');
    setSex('MALE');
  };
  const onCheckWoman = () => {
    setIsCheckMan('2');

    setSex('FEMALE');
  };
  const onChangeEmail = (payload: React.SetStateAction<string>) =>
    setEmail(payload);
  const onSubmitEmail = async () => {
    console.log(email);
    try {
      const send = await axios
        .post(`${Config.API_URL}/api/login/mailConfirm`, {
          email,
        })
        .then(response1 => {
          if (response1.status) {
            Alert.alert('이메일로 인증코드를 보냈습니다.');
            console.log(send);
            console.log(response1.data);
            setVerifyNum(String(response1.data));
          }
        });
    } catch (error) {
      console.log(error);
    }
    return;
  };
  const onVerifyUserNum = useCallback(() => {
    if (verifyUserNum.length === 8 && verifyUserNum === verifyNum) {
      console.log('이메일 인증 번호 일치');
      Alert.alert('인증번호가 일치합니다');
      setVerify(true);
      setProvider('NORMAL');
      setProviderId('');
    } else {
      setVerify(false);
      console.log(verify);
      Alert.alert('인증번호가 일치하지 않습니다');
    }
  }, [verifyUserNum, verifyNum, verify]);
  const onUserNum = (text: React.SetStateAction<string>) => {
    setVerifyUserNum(text);
  };
  const onChangePass = (payload: React.SetStateAction<string>) => {
    setPassword(payload);
  };
  const onCheckPass = (payload: React.SetStateAction<string>) =>
    setCheckPass(payload);

  const toFinSignUp = useCallback(async () => {
    if (!password || !checkPass) {
      return Alert.alert('비밀번호를 확인해주세요');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (password !== checkPass) {
      return Alert.alert('비밀번호가 다릅니다');
    }
    if (verifyUserNum === '') {
      return Alert.alert('이메일 인증을 완료해주세요');
    }
    if (password === checkPass && verify === true && name !== '') {
      console.log(name, sex, email, password);
      console.log(Config.API_URL);
      try {
        const response = await axios
          .post(`${Config.API_URL}/api/user/signup`, {
            name,
            email,
            password,
            nickname,
            provider,
            providerId,
            sex,
          })
          .then(() => {
            console.log(response);
          });
        navigation.navigate('FinishSignUp');
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.error(errorResponse);
        if (errorResponse) {
          Alert.alert('알림', errorResponse.data.message);
        }
      } finally {
      }
    }
  }, [
    password,
    checkPass,
    email,
    verifyUserNum,
    verify,
    name,
    sex,
    nickname,
    provider,
    providerId,
    navigation,
  ]);
  return (
    <DismissKeyboardView style={styles.mainView}>
      <View style={styles.container}>
        <Text style={styles.conText}>회원님의 정보를</Text>
        <Text style={styles.conText}>입력해 주세요</Text>

        <View style={styles.container2}>
          <View style={styles.nameView1}>
            <View style={styles.nameText1}>
              <SignText text="이름" />
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    borderColor: name !== '' ? '#8AA2F8' : '#C4C4C4',
                  },
                ]}
                placeholder="이름입력칸"
                onChangeText={onChangeName}
                onSubmitEditing={onSubmitName}
                keyboardType="default"
              />
            </View>
            <View style={styles.sexView1}>
              <SignText text="성별" />
              <View style={styles.sexBtnView1}>
                <TouchableOpacity
                  style={[
                    styles.sexManBtn,
                    {
                      borderColor: isCheckMan === '1' ? '#8AA2F8' : '#C4C4C4',
                    },
                  ]}
                  onPress={onCheckMan}>
                  <Text
                    style={[
                      styles.sexFemText,
                      {color: isCheckMan === '1' ? '#8AA2F8' : 'black'},
                    ]}>
                    남
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sexFemBtn,
                    {
                      borderColor: isCheckMan === '2' ? '#8AA2F8' : '#C4C4C4',
                    },
                  ]}
                  onPress={onCheckWoman}>
                  <Text
                    style={[
                      styles.sexFemText,
                      {color: isCheckMan === '2' ? '#8AA2F8' : 'black'},
                    ]}>
                    여
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.emailViewContainer}>
            <View style={styles.emailView}>
              <SignText text="이메일" />
              <View style={styles.emailView2}>
                <SignTextInput
                  placeholder={undefined}
                  onChangeText={onChangeEmail}
                  onSubmitEditing={undefined}
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
                <TouchableOpacity
                  style={styles.emailSend}
                  onPress={onSubmitEmail}>
                  <Text style={styles.emailSendText}>인증</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.emailverifyText}>
              입력하신 이메일로 인증메일을 보내드려요
            </Text>
          </View>
          <View style={styles.emailverify}>
            <SignText text="인증번호" />
            <View style={styles.emailverifyView}>
              <SignTextInput
                placeholder="숫자를 입력해 주세요"
                // onChangeText={onVerifyUserNum}
                onChangeText={onUserNum}
                onSubmitEditing={undefined}
                keyboardType={undefined}
                textContentType="oneTimeCode"
                secureTextEntry
                value={verifyUserNum}
                style={[
                  styles.emailVerifyInput,
                  {
                    borderColor: verify === true ? '#8AA2F8' : '#C4C4C4',
                  },
                ]}
              />
              <TouchableOpacity
                style={styles.emailSend}
                onPress={onVerifyUserNum}>
                <Text style={styles.emailSendText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.passView1}>
            <SignText text="비밀번호" />
            <SignTextInput
              placeholder={''}
              onChangeText={onChangePass}
              onSubmitEditing={undefined}
              keyboardType={undefined}
              textContentType="password"
              secureTextEntry
              value={password}
              style={[
                undefined,
                {
                  borderColor: password !== '' ? '#8AA2F8' : '#C4C4C4',
                },
              ]}
            />
          </View>
          <View style={styles.passView2}>
            <SignText text="비밀번호 확인" />
            <SignTextInput
              placeholder={undefined}
              onChangeText={onCheckPass}
              onSubmitEditing={undefined}
              keyboardType={undefined}
              textContentType="password"
              secureTextEntry
              value={undefined}
              style={[
                undefined,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  borderColor:
                    //기본색은 '#C4C4C4'
                    checkPass !== ''
                      ? //입력시 'red'
                        //비밀번호 일치시 '#8AA2F8'
                        password === checkPass
                        ? '#8AA2F8'
                        : '#ff0000'
                      : '#C4C4C4',
                },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={styles.signView}>
        <SignBtn
          activeOpacity={0.9}
          onPress={toFinSignUp}
          text="회원 가입 완료"
        />
      </View>
    </DismissKeyboardView>
  );
}
const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    marginLeft: '8%',
    marginRight: '8%',
    paddingTop: 30,
  },
  container2: {
    flex: 0.8,
  },
  signView: {
    flex: 0.1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
  },
  //--//
  conText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '700',
    alignSelf: 'baseline',
  },
  //--//
  nameView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  nameText1: {
    flexDirection: 'column',
  },
  nameInput: {
    color: 'black',
    width: WIDTH * 0.45,
    paddingLeft: 15,
    borderColor: '#C4C4C4',
    borderWidth: 2,
    borderRadius: 15,
  },
  sexView1: {
    flexDirection: 'column',
    width: WIDTH * 0.3,
  },
  sexBtnView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexManBtn: {
    width: WIDTH * 0.13,
    borderWidth: 2,
    borderRadius: 15,
  },
  sexManText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  sexFemBtn: {
    width: WIDTH * 0.13,
    borderWidth: 2,
    borderRadius: 15,
  },
  sexFemText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
    height: 50.7,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  emailViewContainer: {
    flexDirection: 'column',
    marginTop: 20,
  },
  //--//
  emailView: {
    flexDirection: 'column',
  },
  emailView2: {
    flexDirection: 'row',
  },
  emailInput: {
    flex: 1,
  },
  emailverifyText: {
    color: 'black',
    opacity: 0.5,
    marginLeft: 15,
    fontSize: 12,
  },
  emailverify: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  emailverifyView: {
    flexDirection: 'row',
  },
  emailVerifyInput: {
    flex: 1,
  },
  emailSend: {
    backgroundColor: '#8AA2F8',
    justifyContent: 'center',
    width: WIDTH * 0.13,
    borderRadius: 15,
    marginLeft: 15,
    height: 50.7,
  },
  emailSendText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  //--//
  passView1: {
    marginTop: 20,
  },
  //--//
  passView2: {
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 20,
  },
  //--//
});
export default EmailSignUp;
