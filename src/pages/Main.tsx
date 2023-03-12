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
import useCounter from '../components/useCounter';

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
  const [routeCoordinates, setRouteCoordinates] = useState<CoordinateLongitudeLatitude[]>([]); //기본 배열
  const [energyCoordinates, setEnergyCoordinates] = useState<CoordinateLongitudeLatitude[]>([]); //에너지 떨어짐 배열

  const [distanceTravelled, setDistanceTravelled] = useState<Number>(0); //거리
  const [firstDistance, setFirstDistance] = useState<Number>(0); //측정 거리
  const [energyDistance, setEnergyDistance] = useState<Number>(0); //에너지 떨어짐 거리

  const [prevLatLng, setPrevLatLng] = useState<CoordinateLongitudeLatitude | null>(null);

  const [startBtn, setStartBtn] = useState(false); //산책 시작 버튼 state
  const [resultBtn, setResultBtn] = useState(false); //결과창 실행 버튼 state
  const [energyBtn, setEnergyBtn] = useState(false); //에너지 떨어짐 버튼 state

  const [currentHours, setCurrentHours] = useState<Number>(0); //시간
  const [currentMinutes, setCurrentMinutes] = useState<Number>(0); //분
  const [currentSeconds, setCurrentSeconds] = useState<Number>(0); //초
  const [firstHours, setFirstHours] = useState<Number>(0); //측정 시간
  const [firstMinutes, setFirstMinutes] = useState<Number>(0); //측정 분 
  const [firstSeconds, setFisrtSeconds] = useState<Number>(0); //측정 초
  const [energyHours, setEnergyHours] = useState<Number>(0); //에너지 떨어짐 시간
  const [energyMinutes, setEnergyMinutes] = useState<Number>(0); //에너지 떨어짐 분
  const [energySeconds, setEnergySeconds] = useState<Number>(0); //에너지 떨어짐 초
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
        startBtn ? energyBtn ? setEnergyCoordinates(prev => [...prev, newCoordinate]): setRouteCoordinates(prev => [...prev, newCoordinate]) 
        : null ;
        
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
  }, [startBtn, energyBtn]); //prevLatLng TODO 무한렌더링 문제 해결해야함

  
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
  console.log('일반 배열: ', routeCoordinates);
  console.log('에너지 떨어짐 배열: ', energyCoordinates);
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
          startBtn ? 
            <Polyline
              coordinates={routeCoordinates.length <= 2 ? [
                {latitude: myPosition.latitude, longitude: myPosition.longitude},
                {latitude: myPosition.latitude, longitude: myPosition.longitude}, 
              ]: routeCoordinates}
              strokeWidth={5}
            /> : null
          )}
          {myPosition?.latitude && (
          energyBtn ? 
            <Polyline
              coordinates={energyCoordinates.length <= 2 ? [
                routeCoordinates[routeCoordinates.length-1],
                {latitude: myPosition.latitude, longitude: myPosition.longitude}, 
              ]: energyCoordinates}
              strokeWidth={5}
              strokeColor='red'
            /> : null
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
                  setEnergyDistance(distanceTravelled.toFixed(2) - firstDistance.toFixed(2));
                  setEnergyHours(currentHours - firstHours);
                  setEnergyMinutes(currentMinutes - firstMinutes);
                  setEnergySeconds(currentSeconds - firstSeconds);
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
              backgroundColor: energyBtn ? 'green' : 'red',
              zIndex: 1,
              position: 'absolute',
              bottom: 20
            }}>
              <TouchableOpacity onPress={()=> {
                Alert.alert(
                  "에너지가 떨어지셨나요?", '에너지 떨어짐 확인',
                  [
                    {
                      text: '확인',
                      onPress: () => {
                        setEnergyBtn(true);
                        setFirstDistance(distanceTravelled);
                        setFirstHours(currentHours);
                        setFirstMinutes(currentMinutes);
                        setFisrtSeconds(currentSeconds);
                        setEnergyCoordinates([routeCoordinates[routeCoordinates.length-1]]);
                      }
                    },
                    {
                      text: '취소'
                    }
                  ]
                  )
                // setEnergyBtn(true);
                // setFirstDistance(distanceTravelled);
                // setFirstHours(currentHours);
                // setFirstMinutes(currentMinutes);
                // setFisrtSeconds(currentSeconds);
                // setEnergyCoordinates([routeCoordinates[routeCoordinates.length-1]]);
                }}>
                <Text>에너지</Text>
                <Text>떨어짐</Text>
                <Text>{energyBtn ? 'on' : 'off'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          ) : (
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
              onPress={() => {setStartBtn(true); startcnt();}}>
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
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>산책 결과: </Text>
              <Text style={{fontSize: 12}}>거리 {distanceTravelled.toFixed(2)} km , </Text>
              {/* <Text style={{fontSize: 12}}>처음거리 {firstDistance.toFixed(2)} km , </Text> */}
              <Text style={{fontSize: 12}}>시간 {currentHours < 10 ? `0${currentHours}`: currentHours}:
                            {currentMinutes < 10 ? `0${currentMinutes}`: currentMinutes}:
                            {currentSeconds < 10 ? `0${currentSeconds}`: currentSeconds} </Text>
            </View>
            {energyBtn ? 
              <View
              style={{
                flexDirection: 'row',
                alignContent: 'space-around',
                alignItems: 'center',
                // alignSelf: 'center',
                marginHorizontal: 20,
                marginBottom: 10,
              }}>
                <Text style={{fontSize: 12}}>에너지 떨어진 거리 {energyDistance.toFixed(2)} km , </Text>
                <Text style={{fontSize: 12}}>에너지 떨어진 시간 {energyHours < 10 ? `0${energyHours}`: energyHours}:
                {energyMinutes < 10 ? `0${energyMinutes}`: energyMinutes}:
                {energySeconds < 10 ? `0${energySeconds}`: energySeconds} </Text>
              </View> 
              : null}
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
                  {myPosition?.latitude && (
                    <Polyline
                      coordinates={energyCoordinates.length <= 2 ? [
                        {latitude: myPosition.latitude, longitude: myPosition.longitude},
                        {latitude: myPosition.latitude, longitude: myPosition.longitude}, 
                      ]: energyCoordinates}
                      strokeWidth={5}
                      strokeColor='red'
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
              setEnergyCoordinates([]); //에너지 떨어짐 배열 초기화
              setDistanceTravelled(0); //측정거리 초기화
              setPrevLatLng(null); //이전거리 초기화      
              setEnergyBtn(false);//에너지 떨어짐 버튼 초기화    
              setFirstDistance(0); //측정 거리 초기화
              setEnergyDistance(0); //에너지 떨어짐 거리 초기화
              setFirstHours(0); //측정 시간 초기화
              setFirstMinutes(0); //측정 분 초기화
              setFisrtSeconds(0); //측정 초 초기화
              setEnergyHours(0); //에너지 떨어짐 시간 초기화
              setEnergyMinutes(0); //에너지 떨어짐 분 초기화
              setEnergySeconds(0); //에너지 떨어짐 초 초기화
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
