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
} from 'react-native';
import {RootStackParamList} from '../../App';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import SignBtn from '../components/signBtn';
import SignText from '../components/signText';
type ScreenProps = NativeStackScreenProps<RootStackParamList, 'FinishSignUp'>;
const {width: WIDTH} = Dimensions.get('window');

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

  const onChangeName = (payload: React.SetStateAction<string>) =>
    setName(payload);
  const onSubmitName = () => {
    Alert.alert(name);
    console.log(name);
  };
  const onCheckMan = () => {
    setIsCheckMan('1');
    setSex('man');
  };
  const onCheckWoman = () => {
    setIsCheckMan('2');

    setSex('woman');
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
      Alert.alert('비밀번호가 다릅니다');
    }
    if (password === checkPass && verify === true && name !== '') {
      console.log(name, sex, email, password);
      console.log(Config.API_URL);
      try {
        const response = await axios
          .post(`${Config.API_URL}/api/book`, {
            name,
            sex,
            email,
            password,
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
  }, [password, checkPass, email, verify, name, sex, navigation]);
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.conText}>이메일회원가입페이지</Text>
      </View>
      <View style={styles.container2}>
        <View style={styles.nameView1}>
          <SignText text="이름" />
          <TextInput
            style={styles.nameInput}
            placeholder="이름입력칸"
            onChangeText={onChangeName}
            onSubmitEditing={onSubmitName}
          />
          <Text style={styles.sexText}>성별</Text>
          <TouchableOpacity
            style={[
              styles.sexManBtn,
              {backgroundColor: isCheckMan === '1' ? 'lightskyblue' : 'white'},
            ]}
            onPress={onCheckMan}>
            <Text style={styles.sexManText}>남</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexFemBtn,
              {backgroundColor: isCheckMan === '2' ? 'lightskyblue' : 'white'},
            ]}
            onPress={onCheckWoman}>
            <Text style={styles.sexFemText}>여</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emailViewContainer}>
          <View style={styles.emailView}>
            <SignText text="이메일" />
            <SignTextInput
              placeholder="이메일 입력칸"
              onChangeText={onChangeEmail}
              onSubmitEditing={undefined}
              keyboardType="email-address"
              textContentType="emailAddress"
              secureTextEntry
              value={email}
            />
          </View>
        </View>
        {/* <SignBtn text="이메일 확인" onPress={onSubmitEmail} /> */}
        <View style={styles.emailverify}>
          <TouchableOpacity style={styles.emailRetry} onPress={onSubmitEmail}>
            <Text style={styles.emailRetryText}>전송</Text>
          </TouchableOpacity>
          <Text
            style={{
              width: WIDTH * 0.67,
              marginLeft: 15,
              textAlignVertical: 'center',
            }}>
            이메일을 확인 후 인증코드를 작성해주세요
          </Text>
        </View>
        <View style={styles.emailverify}>
          <TouchableOpacity style={styles.emailRetry} onPress={onVerifyUserNum}>
            <Text style={styles.emailRetryText}>확인</Text>
          </TouchableOpacity>
          <SignTextInput
            placeholder="인증번호 입력"
            // onChangeText={onVerifyUserNum}
            onChangeText={onUserNum}
            onSubmitEditing={undefined}
            keyboardType={undefined}
            textContentType="oneTimeCode"
            secureTextEntry
            value={verifyUserNum}
          />
        </View>
      </View>
      <View style={styles.container3}>
        <View style={styles.passView1}>
          <SignText text="비밀번호" />
          <SignTextInput
            placeholder="비밀번호 입력칸"
            onChangeText={onChangePass}
            onSubmitEditing={undefined}
            keyboardType={undefined}
            textContentType="password"
            secureTextEntry
            value={password}
          />
        </View>
        <View style={styles.passView2}>
          <SignText text="비밀번호 확인" />
          <SignTextInput
            placeholder="비밀번호확인 입력칸"
            onChangeText={onCheckPass}
            onSubmitEditing={undefined}
            keyboardType={undefined}
            textContentType="password"
            secureTextEntry
            value={undefined}
          />
        </View>
      </View>
      <View style={styles.signView}>
        <SignBtn activeOpacity={0.9} onPress={toFinSignUp} text="회원가입" />
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    borderBottomWidth: 1,
    borderBottomColor: '#778899',
    borderStyle: 'dashed',
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 50,
  },
  container2: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    paddingBottom: 5,
  },
  container3: {
    flex: 0.8,
    paddingTop: 15,
    marginLeft: 20,
    marginRight: 20,
    borderTopColor: '#778899',
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  signView: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
  },
  //--//
  conText: {
    fontSize: 30,
    alignSelf: 'center',
  },
  //--//
  nameView1: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  nameInput: {
    backgroundColor: 'white',
    width: WIDTH * 0.26,
    marginLeft: 15,
    borderWidth: 1,
    borderRadius: 3,
  },
  sexText: {
    marginLeft: 22,
    textAlignVertical: 'center',
  },
  sexManBtn: {
    backgroundColor: 'white',
    width: WIDTH * 0.13,
    justifyemail: 'center',
    marginLeft: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  sexManText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 50.7,
    textAlignVertical: 'center',
  },
  sexFemBtn: {
    backgroundColor: 'white',
    width: WIDTH * 0.13,
    justifyemail: 'center',
    borderColor: 'black',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  sexFemText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    height: 50.7,
    textAlignVertical: 'center',
  },
  emailViewContainer: {},
  //--//
  emailView: {
    flexDirection: 'row',
  },
  emailverify: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emailInput: {
    width: WIDTH * 0.67,
    borderWidth: 1,
    borderRadius: 3,
  },
  emailRetry: {
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    width: WIDTH * 0.13,
    height: 40,
    borderRadius: 15,
    margin: 4,
  },
  emailRetryText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  //--//
  passView1: {
    flexDirection: 'row',
  },
  //--//
  passView2: {
    flexDirection: 'row',
    marginTop: 20,
  },
  //--//
});
export default EmailSignUp;
