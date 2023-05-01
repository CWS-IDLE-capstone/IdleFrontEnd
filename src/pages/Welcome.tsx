import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function Welcome({navigation}: ScreenProps) {
  const toStart = useCallback(() => {
    navigation.navigate('Start');
  }, [navigation]);
  return (
    <>
      <View>
        <ImageBackground
          source={require('../assets/bg1.jpg')}
          style={styles.bgImage}>
          <Text style={styles.text1}>CWS-IDLE</Text>
          <Text style={styles.text2}>환영합니다!</Text>
          <TouchableOpacity
            style={styles.btnAlign}
            activeOpacity={0.5}
            onPress={toStart}>
            <Text style={styles.btnStyle}>Login</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </>
  );
}

const {width: WIDTH} = Dimensions.get('window');
const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    height: '100%',
  },
  text1: {
    alignSelf: 'center',
    marginTop: 149,
    marginBottom: 5,
    fontSize: 40,
    color: '#FFFFFF',
  },
  text2: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 40,
    color: '#FFFFFF',
  },
  btnAlign: {
    alignSelf: 'center',
    marginTop: 230,
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

export default Welcome;
