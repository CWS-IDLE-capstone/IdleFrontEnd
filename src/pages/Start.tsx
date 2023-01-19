import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUp',
  'Login'
>;

function Start({navigation}: ScreenProps) {
  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);
  return (
    <>
      <View style={{flex:1, backgroundColor: '#FFFFFF'}}>
        <TouchableOpacity style={styles.btn1Align} activeOpacity={0.5} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnStyle}>Login</Text>
          </TouchableOpacity>
        <Text  style={{alignSelf: 'center'}}>or</Text>
        <TouchableOpacity style={styles.btn2Align} activeOpacity={0.5} onPress={toSignUp}>
            <Text style={styles.btnStyle}>Create Account</Text>
          </TouchableOpacity>
      </View>
    </>
  );
}

const {width: WIDTH} = Dimensions.get('window');
const styles = StyleSheet.create({
  btn1Align: {
    alignSelf: 'center',
    marginTop: 450,
    marginBottom: 5,
  },btn2Align: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  btnStyle: {
    backgroundColor: '#6A74CF',
    width: WIDTH * 0.7,

    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 77,
  },

});

export default Start;
