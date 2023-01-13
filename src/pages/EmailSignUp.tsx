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
} from 'react-native';
import {RootStackParamList} from '../../App';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// import Config from 'react-native-config';
type ScreenProps = NativeStackScreenProps<RootStackParamList, 'FinishSignUp'>;
const {width: WIDTH} = Dimensions.get('window');

function EmailSignUp({navigation}: ScreenProps) {
  const [name, setName] = useState('');
  const [isCheckMan, setIsCheckMan] = useState(false);
  const [isCheckWoman, setIsCheckWoman] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPass, setCheckPass] = useState('');

  const onChangeName = (payload: React.SetStateAction<string>) =>
    setName(payload);
  const onSubmitName = () => {
    alert(name);
    console.log(name);
  };
  const onCheckMan = () => {
    setIsCheckMan(true);
    if (isCheckWoman === true) {
      setIsCheckWoman(current => !current);
    }
  };
  const onCheckWoman = () => {
    setIsCheckWoman(true);
    if (isCheckMan === true) {
      setIsCheckMan(current => !current);
    }
  };
  const onChangeEmail = (payload: React.SetStateAction<string>) =>
    setEmail(payload);
  const onSubmitEmail = () => {
    alert(email);
  };
  const onChangePass = (payload: React.SetStateAction<string>) => {
    setPassword(payload);
  };
  const onCheckPass = (payload: React.SetStateAction<string>) => {
    setCheckPass(payload);
  };
  const toFinSignUp = useCallback(() => {
    if (password === checkPass) {
      navigation.navigate('FinishSignUp');
    }
  }, [checkPass, navigation, password]);
  // const toFinSignUp = useCallback(async () => {
  //   console.log(Config.API_URL);
  // }, []);
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
              {backgroundColor: isCheckMan ? 'lightskyblue' : 'white'},
            ]}
            onPress={onCheckMan}>
            <Text style={styles.sexManText}>남</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexFemBtn,
              {backgroundColor: isCheckWoman ? 'lightskyblue' : 'white'},
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
              // onSubmitEditing={onSubmitEmail}
              keyboardType="email-address"
              textContentType="password"
              secureTextEntry
            />
          </View>
          <TouchableOpacity onPress={onSubmitEmail}>
            <Text
              style={[
                styles.emailBtn,
                {
                  backgroundColor:
                    email.length < 6 ? 'lightgray' : 'lightskyblue',
                },
              ]}>
              이메일 인증
            </Text>
          </TouchableOpacity>
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
          />
        </View>
      </View>
      <View style={styles.signView}>
        <TouchableOpacity activeOpacity={0.9} onPress={toFinSignUp}>
          <Text
            style={[
              styles.signBtn,
              {backgroundColor: onChangePass ? 'lightgray' : 'lightskyblue'},
            ]}>
            회원가입
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-end',
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 50,
  },
  container2: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 5,
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
    height: 38,
    justifyContent: 'center',
    marginLeft: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  sexManText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sexFemBtn: {
    backgroundColor: 'white',
    width: WIDTH * 0.13,
    height: 38,
    justifyContent: 'center',
    borderColor: 'black',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  sexFemText: {
    fontWeight: 'bold',
    textAlign: 'center',
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
  emailBtn: {
    backgroundColor: 'skyblue',
    width: WIDTH * 0.8,
    height: 35,
    alignSelf: 'flex-end',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 5,
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
  signBtn: {
    backgroundColor: 'lightgray',
    width: WIDTH * 0.8,
    height: 40,
    alignSelf: 'flex-end',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
    marginTop: 40,
    marginBottom: 5,
  },
});
export default EmailSignUp;
