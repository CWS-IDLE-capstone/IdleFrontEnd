import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {
  Pressable,
  Text,
  View,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import NaverMapView from 'react-native-nmap';
import {RootStackParamList} from '../../App';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function Main({navigation}: ScreenProps) {
  return (
    <View>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: Dimensions.get('window').width - 30,
          height: 200,
          marginTop: 10,
        }}>
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          zoomControl={false}
          center={{
            zoom: 10,
            tilt: 50,
            latitude: 37.380887648,
            longitude: 126.6679412,
          }}
        />
        {/* <Text style={{alignSelf: 'center', marginTop: 220, fontSize: 60}}>
          메인 화면
        </Text> */}
      </View>
    </View>
  );
}

export default Main;
