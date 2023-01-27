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
        .post(`${Config.API_URL}/api/verify`, {
          email,
        })
        .then(() => {
          console.log(send);
        });
    } catch (error) {
      console.log(error);
    }
    return setVerifyUserNum;
  };
  const onSubmitEmail1 = () => {
    console.log('재전송');
  };
  const onVerifyNum = useCallback(
    text => {
      setVerifyNum(text);
      if (verifyUserNum === verifyNum) {
        console.log('이메일 인증 번호 일치');
        setVerify(true);
        console.log(verify);
      }
    },
    [verifyUserNum, verifyNum, verify],
  );
  const onChangePass = (payload: React.SetStateAction<string>) =>
    setPassword(payload);
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
    if (password === checkPass && verify === true) {
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
          <Text style={styles.nameText}>이름</Text>
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
            <Text style={styles.emailText}>이메일</Text>
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
        <SignBtn text="이메일 확인" onPress={onSubmitEmail} />
        <View style={styles.emailverify}>
          <TouchableOpacity style={styles.emailRetry} onPress={onSubmitEmail1}>
            <Text style={styles.emailRetryText}>재전송</Text>
          </TouchableOpacity>
          <SignTextInput
            placeholder="인증번호 입력"
            onChangeText={onVerifyNum}
            onSubmitEditing={undefined}
            keyboardType={undefined}
            textContentType="oneTimeCode"
            secureTextEntry
            value={verifyNum}
          />
        </View>
      </View>
      <View style={styles.container3}>
        <View style={styles.passView1}>
          <Text style={styles.passText}>비밀번호</Text>
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
          <Text style={styles.passChkText}>비밀번호 확인</Text>
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
  nameText: {
    textAlignVertical: 'center',
    width: WIDTH * 0.2,
    textAlign: 'right',
  },
  nameInput: {
    backgroundColor: 'white',
    width: WIDTH * 0.26,
    marginLeft: 17,
    borderWidth: 1,
    borderRadius: 3,
  },
  sexText: {
    marginLeft: 20,
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
  emailText: {
    width: WIDTH * 0.2,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  emailverify: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emailInput: {
    backgroundColor: 'red',
    width: WIDTH * 0.67,
    borderWidth: 1,
    borderRadius: 3,
  },
  emailRetry: {
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    width: WIDTH * 0.13,
    borderRadius: 15,
  },
  emailRetryText: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  //--//
  passView1: {
    flexDirection: 'row',
  },
  passText: {
    width: WIDTH * 0.2,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  //--//
  passView2: {
    flexDirection: 'row',
    marginTop: 20,
  },
  passChkText: {
    width: WIDTH * 0.2,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  //--//
});
export default EmailSignUp;
