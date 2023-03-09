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
import haversine from 'haversine';

const useCounter = (initialValue: number, ms: number) => { //커스텀 hook 시간세는 함수
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

interface CoordinateLongitudeLatitude {
  latitude: number;
  longitude: number;
}


// type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
type MainScreenProps = NativeStackScreenProps<LoggedInParamList, 'Community'>;
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
console.log('------');  //const { count, startcnt, stop, reset} = useCounter(0, 1000);
function Main({navigation}: MainScreenProps) {
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<CoordinateLongitudeLatitude[]>([]);
  const [energyCoordinates, setEnergyCoordinates] = useState<CoordinateLongitudeLatitude[]>([]);
  const [distanceTravelled, setDistanceTravelled] = useState(0);
  const [prevLatLng, setPrevLatLng] = useState<CoordinateLongitudeLatitude | null>(null);
  const [startBtn, setStartBtn] = useState(true); //산책 시작 버튼 state
  const [resultBtn, setResultBtn] = useState(false); //결과창 실행 버튼 state
  const [energyBtn, setEnergyBtn] = useState(false); //에너지 떨어짐 버튼 state
  const [polylineColor, setPolylineColor] = useState<string>('#000000'); //폴리라인 컬러
  const [currentHours, setCurrentHours] = useState<Number>(0);
  const [currentMinutes, setCurrentMinutes] = useState<Number>(0);
  const [currentSeconds, setCurrentSeconds] = useState<Number>(0);
  const { count, startcnt, stop, reset} = useCounter(0, 1000);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();


  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const newCoordinate: CoordinateLongitudeLatitude = { latitude, longitude };
        setMyPosition(newCoordinate);
        setRouteCoordinates([newCoordinate]);
        // setPrevLatLng(null);
        console.log('getCurrentPosition 실행')
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 50,
      },
    );
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      info => {
        const { latitude, longitude } = info.coords;
        const newCoordinate: CoordinateLongitudeLatitude = { latitude, longitude };
        setMyPosition(newCoordinate);
        setRouteCoordinates(prev => [...prev, newCoordinate]);
        
        if (prevLatLng) {
          setDistanceTravelled(distanceTravelled + calcDistance(prevLatLng, newCoordinate));
        }

        setPrevLatLng(newCoordinate);
        console.log('watchPosition 실행')
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 1, //미터임
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
      console.log('clearWatch 실행')
    };
  }, [prevLatLng]); //prevLatLng TODO 무한렌더링 문제 해결해야함

  


  const calcDistance = (prevLatLng: CoordinateLongitudeLatitude, newLatLng: CoordinateLongitudeLatitude) => {
    return haversine(prevLatLng, newLatLng) || 0;
  };

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

  console.log('거리: ', distanceTravelled.toFixed(2), 'km');
  // console.log('5');
  // console.log(myPosition);
  console.log(routeCoordinates);
  // console.log("routeCoordinatesRef: ", routeCoordinatesRef.current);
  
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: WIDTH,
        height: HEIGHT * 0.85 , //HEIGHT * 0.83
        backgroundColor: 'yellow',
      }}>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        zoomControl={true}
        // showsMyLocationButton={true}
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
                {latitude: myPosition.latitude, longitude: myPosition.longitude},
                {latitude: myPosition.latitude, longitude: myPosition.longitude}, 
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
                    {distanceTravelled.toFixed(2)} km
                </Text>
                <Text style={{ textAlign: 'center'}}> 거리</Text>
              </View>
              <View style={{
                backgroundColor: 'white',
                flex: 1,
                height: 80,
                alignContent: 'center',
                alignItems: 'center'
              }}>
                <TouchableOpacity 
                  onPress={() => { 
                    setResultBtn(prev => !prev);
                    stop();
                    // console.log(`거리 : ${distanceTravelled.toFixed(2)} km, 
                    // 시간: ${currentHours < 10 ? `0${currentHours}`: currentHours}: 
                    // ${currentMinutes < 10 ? `0${currentMinutes}`: currentMinutes}: 
                    // ${currentSeconds < 10 ? `0${currentSeconds}`: currentSeconds}`
                    // )
                  }}
                    
                    > 
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
              <View style={{
                backgroundColor: 'red',
                zIndex: 1,
                position: 'absolute'
              }}>
                <TouchableOpacity onPress={()=> {setEnergyBtn(prev => !prev)}}>
                  <Text>에너지</Text>
                  <Text>떨어짐</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

      </View>
      {resultBtn ? (
        <View style={{
          backgroundColor: 'yellow',
          zIndex: 1,
          position: 'absolute',
          width: WIDTH,
          height: HEIGHT * 0.7,
          top: 0
        }}>
          <View style={{
            top: 10,
          }}>
            <Text style={{fontSize: 20, marginHorizontal: 20, marginBottom: 10}}>{year}. {month}. {day} (일)</Text>
            <Text style={{fontSize: 25, fontWeight: 'bold', marginLeft: 20, marginRight: 70, marginBottom: 10}}>오늘도 열심히 산책해서 멋있어요</Text>
            <View style={{
              flexDirection: 'row',
              alignContent: 'space-around',
              alignItems: 'center',
              // alignSelf: 'center',
              marginHorizontal: 20,
              marginBottom: 10,
            }}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>산책결과: </Text>
              <Text style={{fontSize: 15}}>거리 {distanceTravelled.toFixed(2)} km , </Text>
              <Text style={{fontSize: 15}}>시간 {currentHours < 10 ? `0${currentHours}`: currentHours}:
                            {currentMinutes < 10 ? `0${currentMinutes}`: currentMinutes}:
                            {currentSeconds < 10 ? `0${currentSeconds}`: currentSeconds} </Text>
            </View>
            <NaverMapView
                style={{width: '90%', height: '60%', marginHorizontal: 20, marginBottom: 10}}
                zoomControl={true}
                // showsMyLocationButton={true}
                center={{
                  zoom: myPosition ? 16 : 5.5,
                  latitude: myPosition?.latitude ? myPosition?.latitude : 37,
                  longitude: myPosition?.longitude ? myPosition?.longitude : 127.6,
                  // latitude: myPosition?.latitude,
                  // longitude: myPosition?.longitude,
                }}>
                {myPosition?.latitude && (
                    <Polyline
                      coordinates={routeCoordinates.length <= 2 ? [
                        {latitude: myPosition.latitude, longitude: myPosition.longitude},
                        {latitude: myPosition.latitude, longitude: myPosition.longitude}, 
                      ]: routeCoordinates}
                      strokeWidth={5}
                    />
                  )}
            </NaverMapView>         
          </View>
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
            onPress={() => {
              setResultBtn(false); //결과 화면 닫기
              setStartBtn(prev => !prev); //스타트 버튼 열기
              reset(); //시간초기화 
              setRouteCoordinates([]); //폴리라인 배열 초기화
              setDistanceTravelled(0); //측정거리 초기화
              setPrevLatLng(null); //이전거리 초기화              
              }}>
                <Text style={{
                    color: 'white',
                    textAlign: 'center',
                    textAlignVertical: 'bottom',
                    fontSize: 16,
                    fontWeight: 'bold',
                    height: 35,
                }}>
                  확인
                </Text>
          </TouchableOpacity>
        
  
        </View>
      ) : null}
    </View>
  );
}

export default Main;
