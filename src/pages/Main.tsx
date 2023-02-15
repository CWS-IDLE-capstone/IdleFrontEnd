import Geolocation from '@react-native-community/geolocation';
import {NavigationContainer} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  View,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import NaverMapView, {Marker} from 'react-native-nmap';
import {LoggedInParamList} from '../../App';

// type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
type MainScreenProps = NativeStackScreenProps<LoggedInParamList, 'Community'>;
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
console.log('------');
function Main({navigation}: MainScreenProps) {
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  console.log('1');

  useEffect(() => {
    console.log('!!');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setMyPosition({latitude, longitude});
        console.log('2');
        console.log(myPosition?.latitude);
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 50,
      },
    );
  }, [myPosition?.latitude]);

  console.log('3');
  useEffect(() => {
    Geolocation.watchPosition(
      info => {
        console.log(info);
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        // console.log(info.coords.latitude);
        // console.log(info.coords.longitude);
        // console.log(typeof myPosition);
        console.log('4');
        console.log(myPosition);
        // console.log(typeof myPosition.latitude);
        // console.log(typeof myPosition);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 50,
      },
    );
  }, [myPosition]);
  console.log('5');
  console.log(myPosition);
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: WIDTH,
        height: HEIGHT - 55,
        backgroundColor: 'yellow',
      }}>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        zoomControl={false}
        center={{
          zoom: myPosition ? 18 : 5.5,
          latitude: myPosition?.latitude ? myPosition?.latitude : 37,
          longitude: myPosition?.longitude ? myPosition?.longitude : 127.6,
          // latitude: myPosition?.latitude,
          // longitude: myPosition?.longitude,
        }}>
        {myPosition?.latitude && (
          <Marker
            coordinate={{
              latitude: myPosition?.latitude,
              longitude: myPosition?.longitude,
            }}
            width={20}
            height={20}
            image={require('../assets/dpic.jpg')}
          />
        )}
      </NaverMapView>
    </View>
  );
}

export default Main;
