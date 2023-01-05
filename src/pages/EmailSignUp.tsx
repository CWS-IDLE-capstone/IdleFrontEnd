import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
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

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'FinishSignUp'>;
const {width: WIDTH} = Dimensions.get('window');

function EmailSignUp({navigation}: ScreenProps) {
  const toFinSignUp = useCallback(() => {
    navigation.navigate('FinishSignUp');
  }, [navigation]);
  const [isCheckMan, setIsCheckMan] = useState(false);
  const [isCheckFem, setIsCheckFem] = useState(false);
  const onCheck = () => {
    setIsCheckMan((current: any) => !current);
  };
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.conText}>이메일회원가입페이지</Text>
      </View>
      <View style={styles.container2}>
        <View style={styles.nameView1}>
          <Text style={styles.nameText}>이름</Text>
          <TextInput style={styles.nameInput} placeholder="이름입력칸" />
          <Text style={styles.sexText}>성별</Text>
          <TouchableOpacity
            style={[
              styles.sexManBtn,
              {backgroundColor: isCheckMan ? 'green' : 'white'},
            ]}>
            <Text style={styles.sexManText} onPress={onCheck}>
              남
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sexFemBtn,
              {backgroundColor: isCheckMan ? 'white' : 'green'},
            ]}>
            <Text style={styles.sexFemText} onPress={onCheck}>
              여
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emailViewContainer}>
          <View style={styles.emailView}>
            <Text style={styles.emailText}>이메일</Text>
            <TextInput style={styles.emailInput} />
          </View>
          <TouchableOpacity>
            <Text style={styles.emailBtn}>이메일 인증</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container3}>
        <View style={styles.passView1}>
          <Text style={styles.passText}>비밀번호</Text>
          <TextInput
            style={styles.passInput}
            textContentType="password"
            secureTextEntry
          />
        </View>
        <View style={styles.passView2}>
          <Text style={styles.passChkText}>비밀번호 확인</Text>
          <TextInput
            style={styles.passChkInput}
            textContentType="password"
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.signView}>
        <TouchableOpacity activeOpacity={0.9} onPress={toFinSignUp}>
          <Text style={styles.signBtn}>회원가입</Text>
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
    borderTopColor: 'black',
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
  emailInput: {
    backgroundColor: 'white',
    marginLeft: 15,
    width: WIDTH * 0.67,
    borderWidth: 1,
    borderRadius: 3,
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
  passInput: {
    backgroundColor: 'white',
    width: WIDTH * 0.67,
    marginLeft: 15,
    borderWidth: 1,
    borderRadius: 3,
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
  passChkInput: {
    backgroundColor: 'white',
    width: WIDTH * 0.67,
    marginLeft: 15,
    borderWidth: 1,
    borderRadius: 3,
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
    marginTop: 10,
    marginBottom: 5,
  },
});
export default EmailSignUp;
