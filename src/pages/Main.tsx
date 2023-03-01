import Geolocation from '@react-native-community/geolocation';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {TouchableOpacity} from 'react-native'
import {
  Pressable,
  Text,
  View,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';
import {LoggedInParamList} from '../../AppInner';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { current } from '@reduxjs/toolkit';

const useCounter = (initialValue: number, ms: number) => { //커스텀 hook
  const [count, setCount] = useState(initialValue);
  const intervalRef = useRef(null);
  const startcnt = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, ms);
  }, []);
  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, [])
  const reset = useCallback(() => {
    setCount(0);
    stop();
  },[]);
  return {count, startcnt, stop, reset};
}

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
  const [routeCoordinates, SetRouteCoordinates] = useState<any>([]);
  // const routeCoordinatesRef = useRef<any>([]); //TODO useRef 적용해서 배열 무한렌더링 해결하기...
  const [startBtn, setStartBtn] = useState(true); //산책 시작 버튼 state
  const [currentHours, setCurrentHours] = useState<Number>(0);
  const [currentMinutes, setCurrentMinutes] = useState<Number>(0);
  const [currentSeconds, setCurrentSeconds] = useState<Number>(0);
  const { count, startcnt, stop, reset} = useCounter(0, 1000);
  console.log('state 렌더링');

  useEffect(() => {
    // console.log('!!');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setMyPosition({latitude, longitude});
        const newCoordinate = {
          latitude,
          longitude
        };
        // SetRouteCoordinates(routeCoordinates => [...routeCoordinates, newCoordinate]);
        // routeCoordinatesRef.current = [...routeCoordinates, newCoordinate];
        console.log('getCurrentPosition 실행');
        // console.log(myPosition?.latitude);
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 50,
      },
    );

    return () => {
      // Geolocation.clearWatch;
      console.log("currentPosition 그만");
    }
  }, []); //1번만 받아오면 될듯

  useEffect(() => {
    Geolocation.watchPosition(
      info => {
        // console.log("info: ", info);
        const {latitude, longitude} = info.coords;
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        const newCoordinate = {
          latitude,
          longitude
        };
        SetRouteCoordinates(routeCoordinates => [...routeCoordinates, newCoordinate]);
        // routeCoordinatesRef.current = [...routeCoordinates, newCoordinate];
        // console.log(info.coords.latitude);
        // console.log(info.coords.longitude);
        // console.log(typeof myPosition);
        console.log('watchPosition 실행');
        // console.log(typeof myPosition.latitude);
        // console.log(typeof myPosition);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 100, //미터임
      },
    );

    return () => { //cleanUp 함수
      console.log('watchposition 그만');
    }
    
  }, []);
  // console.log('5');
  // console.log(myPosition);
  console.log(routeCoordinates);
  // console.log("routeCoordinatesRef: ", routeCoordinatesRef.current);

  const timer = () => {
    const checkMinutes = Math.floor(count / 60);
    const hours = Math.floor(count / 3600);
    const minutes = checkMinutes % 60;
    const seconds = count % 60;
    setCurrentHours(hours)
    setCurrentSeconds(seconds)
    setCurrentMinutes(minutes)
  }

  useEffect(timer, [count]);
  
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: WIDTH,
        height: HEIGHT * 0.83 ,
        backgroundColor: 'yellow',
      }}>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        zoomControl={true}
        showsMyLocationButton={true}
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
         {myPosition?.latitude && (
            <Polyline
              coordinates={routeCoordinates.length <= 2 ? [
                {
                  latitude: 37.3777, //myPosition.latitude
                  longitude: 126.6356,
                },
                {latitude: myPosition.latitude, longitude: myPosition.longitude}, 
                {latitude: 37.39, longitude: 126.6356}
              ]: routeCoordinates}
              strokeWidth={5}
            />
          )}
        
      </NaverMapView>
      <View style={{ 
        // backgroundColor: 'green', 
        width: '100%', 
        height: 80, 
        zIndex: 1, 
        position: 'absolute',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        bottom: 10,

        }}>
        {startBtn ? (
          <TouchableOpacity style={{ 
            backgroundColor: '#6A74CF', 
            width: '70%', 
            height: 50, 
            zIndex: 1,
            alignSelf: 'center',
            alignContent: 'center',
            alignItems: 'center',
            borderRadius: 77
            }}
            onPress={() => {setStartBtn(false); startcnt();}}>
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                    textAlignVertical: 'bottom',
                    fontSize: 16,
                    fontWeight: 'bold',
                    height: 35,
                }}>
                  산책 시작하기
                </Text>
          </TouchableOpacity>
          ) : (
            <View style={{
              backgroundColor: 'white',
              width: '100%',
              height: 80,
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'space-around',
              }}>
              <View style={{
                backgroundColor: 'white',
                flex: 1,
                height: 80,
                marginLeft: 30
              }}>
                <Text style={{ 
                  textAlign: 'center', 
                  fontSize: 20, 
                  fontWeight: 'bold', 
                  color: 'black',
                  height: 30,
                  marginTop: 10,
                  }}>
                    10m
                </Text>
                <Text style={{ textAlign: 'center'}}>거리</Text>
              </View>
              <View style={{
                backgroundColor: 'white',
                flex: 1,
                height: 80,
                alignContent: 'center',
                alignItems: 'center'
              }}>
                <TouchableOpacity onPress={() => {setStartBtn(true); reset();}}>
                <FontAwesome 
                  name='stop-circle' 
                  style={{
                    fontSize: 60,
                    top: 8,
                    color: '#6A74CF'
                  }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{
                backgroundColor: 'white',
                flex: 1,
                height: 80,
                marginRight: 30
              }}>
                <Text style={{ 
                  textAlign: 'center', 
                  fontSize: 20, 
                  fontWeight: 'bold', 
                  color: 'black',
                  height: 30,
                  marginTop: 10,
                  }}>
                    {currentHours < 10 ? `0${currentHours}`: currentHours}:
                    {currentMinutes < 10 ? `0${currentMinutes}`: currentMinutes}:
                    {currentSeconds < 10 ? `0${currentSeconds}`: currentSeconds}
                </Text>
                <Text style={{ textAlign: 'center'}}>시간</Text>
              </View>
            </View>
          )}

      </View>
    </View>
  );
}

export default Main;