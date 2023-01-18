import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import SignTextInput from '../components/signTextInput';
import {
  Pressable,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import { RootStackParamList } from '../../App';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import DaonBtn from '../components/daonBtn';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function Login({ navigation }: ScreenProps) {
  const toMain = useCallback(() => {
    navigation.navigate('Main');
  }, [navigation]);
  return (
    <>
      <View style={styles.header}>
        <ImageBackground source={require("../assets/bg1.jpg")} style={styles.bgImage}>

          <View style={{flex:2}}>
            <Text style={styles.login}>Login</Text>
            <TextInput style={styles.Input} placeholder="Email" />
            <TextInput style={styles.Input} placeholder="Password" />
            <DaonBtn text="Login" style={styles.gangstyle} activeOpacity={0.5} onPress={toMain} />
          </View>

          <View style={{flex:1}}>
            <View>
              <TouchableOpacity style={styles.row} onPress={toMain}>
                <Text style={styles.naverLogin}>네이버 로그인</Text>
                <Text style={styles.googleLogin}>구글 로그인</Text>
              </TouchableOpacity>
              <Pressable>
                <Text style={styles.lastline} onPress={() => navigation.navigate('SignUp')}>
                  Don't have account? <Text style={{ color: '#6A74CF' }}>Sign up</Text>
                </Text>
              </Pressable>
            </View>
            
            
          </View>

        </ImageBackground>
      </View>
    </>
  );
}

const { width: WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
   
  row: { flexDirection:'row', alignSelf: 'center', marginTop:50, justifyContent: 'space-around', },
  header: { flex: 1 },
  bgImage: { width: '100%', height: '100%' },

  naverLogin: {
    //alignSelf: 'flex-start',
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

  googleLogin: {
    //alignSelf: 'flex-end',
    marginTop: 30,
    marginBottom: 5,
    backgroundColor: '#4285F4',
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
