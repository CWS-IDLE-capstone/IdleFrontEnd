import Geolocation from '@react-native-community/geolocation';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {ScrollView, Share, TouchableOpacity} from 'react-native';
import {
  Pressable,
  Text,
  View,
  Button,
  Alert,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import NaverMapView, {Marker, Polyline} from 'react-native-nmap';
import {LoggedInParamList} from '../../AppInner';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {current} from '@reduxjs/toolkit';
import haversine from 'haversine';
import {useCounter, EuseCounter} from '../components/useCounter';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera} from 'react-native-image-picker';
import ViewShot, {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Config from 'react-native-config';
import axios from 'axios';
import IconRightButton from '../components/IconRightButton';
import Icon from '../components/IconRightButton';

interface CoordinateLongitudeLatitude {
  latitude: number;
  longitude: number;
}

// type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
type MainScreenProps = NativeStackScreenProps<LoggedInParamList, 'Community'>;
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
console.log('------'); //const { count, startcnt, stop, reset} = useCounter(0, 1000);
function Main({navigation}: MainScreenProps) {
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //기본 배열
  const [energyCoordinates, setEnergyCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //에너지 떨어짐 배열
  const [hotplaceCoordinates, setHotplaceCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //핫플 마커 배열
  const [dangerCoordinates, setDangerCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //주의 마커 배열

  const [distanceTravelled, setDistanceTravelled] = useState<Number>(0); //거리
  const [firstDistance, setFirstDistance] = useState<Number>(0); //측정 거리
  const [energyDistance, setEnergyDistance] = useState<Number>(0); //에너지 떨어짐 거리

  const [prevLatLng, setPrevLatLng] =
    useState<CoordinateLongitudeLatitude | null>(null);

  const [startBtn, setStartBtn] = useState(false); //산책 시작 버튼 state
  const [resultBtn, setResultBtn] = useState(false); //결과창 실행 버튼 state
  const [energyBtn, setEnergyBtn] = useState(false); //에너지 떨어짐 버튼 state
  const [markerListBtn, setMarkerListBtn] = useState(false); //마커 리스트 버튼 state
  const [hotMarkerBtn, setHotMarkerBtn] = useState(false); //핫플 마커 버튼 state
  const [dangerMarkerBtn, setDangerMarkerBtn] = useState(false); //주의 마커 버튼 state

  const [currentHours, setCurrentHours] = useState<Number>(0); //시간
  const [currentMinutes, setCurrentMinutes] = useState<Number>(0); //분
  const [currentSeconds, setCurrentSeconds] = useState<Number>(0); //초

  const [energyHours, setEnergyHours] = useState<Number>(0); //에너지 떨어짐 시간
  const [energyMinutes, setEnergyMinutes] = useState<Number>(0); //에너지 떨어짐 분
  const [energySeconds, setEnergySeconds] = useState<Number>(0); //에너지 떨어짐 초
  const {count, startcnt, stop, reset} = useCounter(0, 1000);
  const {Ecount, Estartcnt, Estop, Ereset} = EuseCounter(0, 1000);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const viewShotRef = useRef<null | any>(null);

  const [imageCapture, setImageCapture] = useState(null); //이미지 캡쳐 후 화면표시용
  const [imageCaptureUrl, setImageCaptureUrl] = useState('');
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newCoordinate: CoordinateLongitudeLatitude = {
          latitude,
          longitude,
        };
        setMyPosition(newCoordinate);
        // setRouteCoordinates([newCoordinate]); //처음위치를 무조건 배열에 안넣고 산책시작하면 배열에 넣게 없앴음
        // setPrevLatLng(null);
        console.log('getCurrentPosition 실행');
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 50,
      },
    );
  }, []);
  console.log(today);
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      info => {
        const {latitude, longitude} = info.coords;
        const newCoordinate: CoordinateLongitudeLatitude = {
          latitude,
          longitude,
        };
        setMyPosition(newCoordinate);
        startBtn
          ? energyBtn
            ? setEnergyCoordinates(prev => [...prev, newCoordinate])
            : setRouteCoordinates(prev => [...prev, newCoordinate])
          : null;

        if (prevLatLng) {
          setDistanceTravelled(
            distanceTravelled + calcDistance(prevLatLng, newCoordinate),
          );
        }

        setPrevLatLng(newCoordinate);
        console.log('watchPosition 실행');
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
      console.log('clearWatch 실행');
    };
  }, [startBtn, energyBtn, distanceTravelled]); //prevLatLng TODO 무한렌더링 문제 해결해야함

  const calcDistance = (
    prevLatLng: CoordinateLongitudeLatitude,
    newLatLng: CoordinateLongitudeLatitude,
  ) => {
    return haversine(prevLatLng, newLatLng) || 0;
  };

  /*
  해결해야될것: 마커펼친후 취소위해 다시 닫기 안됨.
  */
  //
  const timer = () => {
    const checkMinutes = Math.floor(count / 60);
    const hours = Math.floor(count / 3600);
    const minutes = checkMinutes % 60;
    const seconds = count % 60;
    setCurrentHours(hours);
    setCurrentSeconds(seconds);
    setCurrentMinutes(minutes);
  };

  const Etimer = () => {
    const checkMinutes = Math.floor(Ecount / 60);
    const hours = Math.floor(Ecount / 3600);
    const minutes = checkMinutes % 60;
    const seconds = Ecount % 60;
    setEnergyHours(hours);
    setEnergySeconds(seconds);
    setEnergyMinutes(minutes);
  };

  // 카메라 촬영
  const onLaunchCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
        saveToPhotos: true, //갤러리에 저장 옵션
      },
      res => {
        if (res.didCancel) {
          //취소했을 경우
          return;
        }
        // setResponse(res); //이미지 보낼때 이거 쓰면 될거같음
      },
    );
  };

  useEffect(timer, [count]);
  useEffect(Etimer, [Ecount]);

  console.log('거리: ', distanceTravelled.toFixed(2), 'km');
  console.log('일반 배열: ', routeCoordinates);
  console.log('에너지 떨어짐 배열: ', energyCoordinates);
  console.log(`count: ${count}, Ecount: ${Ecount}`);
  console.log(
    `currentSeconds: ${currentSeconds}, energySeconds: ${energySeconds}`,
  );

  function captureImage() {
    setTimeout(async () => {
      const imageUri = await viewShotRef.current.capture();
      console.log(imageUri);
      try {
        setImageCapture(imageUri);
        console.log('산책캡쳐완료');
      } catch (error) {
        console.log(error);
      }
    }, 1500);
  }

  const shareImage = async () => {
    try {
      const uri = await captureRef(viewShotRef, {
        format: 'jpg',
        quality: 0.8,
      });
      // const base64Data = await RNFetchBlob.fs.readFile(imageCapture, 'base64');
      const url = `data:image/png;base64,${uri}`;
      await Share.share({
        title: 'walk image',
        message: '',
        url: `${uploadImageToServer.formData._parts[0].uri}`,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const uploadImageToServer = async () => {
    try {
      const formData = new FormData();
      formData.append('images', {
        // key: 'images',
        uri: imageCapture,
        type: 'image/jpg',
        name: 'capturedTestaImage.jpg',
      });

      const response = await axios
        .post(`${Config.API_URL}/api/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          if (res) {
            console.log('res저장');
            console.log(res);
            setImageCaptureUrl(res.data.imageUrl);
            console.log(res.data.imageUrl);
          }
        });
      console.log('Image uploaded successfully:', imageCaptureUrl);
      return imageCaptureUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: WIDTH,
        height: HEIGHT * 0.9, //HEIGHT * 0.83
        backgroundColor: 'yellow',
      }}>
      <NaverMapView
        style={{width: '100%', height: '100%'}}
        zoomControl={true}
        // showsMyLocationButton={true}
        center={{
          zoom: myPosition ? 16 : 5.5,
          latitude: myPosition?.latitude ? myPosition?.latitude : 37,
          longitude: myPosition?.longitude ? myPosition?.longitude : 127.6,
          // latitude: myPosition?.latitude,
          // longitude: myPosition?.longitude,
        }}
        onMapClick={e => {
          const {latitude, longitude} = e;
          const newCoordinate: CoordinateLongitudeLatitude = {
            latitude,
            longitude,
          };
          // setMarker(newCoordinate)
          hotMarkerBtn
            ? setHotplaceCoordinates(prev => [...prev, newCoordinate])
            : null;
          dangerMarkerBtn
            ? setDangerCoordinates(prev => [...prev, newCoordinate])
            : null;
          // console.log(hotplaceCoordinates);
          setMarkerListBtn(false);
          setDangerMarkerBtn(false);
          setHotMarkerBtn(false);
          // console.log(`latitude: ${e.latitude}, longitude: ${e.longitude}`);
        }}>
        {hotplaceCoordinates.map((coordinate, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}
            image={require('../assets/hotplace.png')}
            width={30}
            height={30}
            onClick={() => {
              const newCoordinates = hotplaceCoordinates.filter(
                (c, i) => i !== index,
              );
              setHotplaceCoordinates(newCoordinates);
            }}
          />
        ))}

        {dangerCoordinates.map((coordinate, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}
            image={require('../assets/danger.png')}
            width={30}
            height={30}
            onClick={() => {
              const newCoordinates = dangerCoordinates.filter(
                (c, i) => i !== index,
              );
              setDangerCoordinates(newCoordinates);
            }}
          />
        ))}

        {myPosition?.latitude && (
          <Marker
            coordinate={{
              latitude: myPosition?.latitude,
              longitude: myPosition?.longitude,
            }}
            width={40}
            height={42}
            image={require('../assets/dogIcon2.png')}
          />
        )}
        {myPosition?.latitude &&
          (startBtn ? (
            <Polyline //일반 폴리라인
              coordinates={
                routeCoordinates.length <= 2
                  ? [
                      {
                        latitude: myPosition.latitude,
                        longitude: myPosition.longitude,
                      },
                      {
                        latitude: myPosition.latitude,
                        longitude: myPosition.longitude,
                      },
                    ]
                  : routeCoordinates
              }
              strokeWidth={10}
              strokeColor="#1EFF34"
            />
          ) : null)}
        {myPosition?.latitude &&
          (energyBtn ? (
            <Polyline //에너지 떨어짐 폴리라인
              coordinates={
                energyCoordinates.length <= 2
                  ? [
                      routeCoordinates[routeCoordinates.length - 1],
                      {
                        latitude: myPosition.latitude,
                        longitude: myPosition.longitude,
                      },
                    ]
                  : energyCoordinates
              }
              strokeWidth={10}
              strokeColor="#F19900"
            />
          ) : null)}
      </NaverMapView>
      {markerListBtn ? (
        <View style={styles.MarkerListView}>
          <TouchableOpacity
            onPress={() => {
              setHotMarkerBtn(true);
              setMarkerListBtn(false);
            }}>
            <View>
              <Image
                source={require('../assets/hotplace.png')}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
              <Text style={styles.MarkerListText}>핫플레이스</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setDangerMarkerBtn(true);
              setMarkerListBtn(false);
            }}>
            <View>
              <Image
                source={require('../assets/danger.png')}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
              <Text style={styles.MarkerListText}>주의 지역</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onLaunchCamera();
              setMarkerListBtn(false);
            }}>
            <View>
              <Image
                source={require('../assets/camera.png')}
                style={{
                  width: 40,
                  height: 40,
                }}
              />
              <Text style={styles.MarkerListText}>카메라</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.MarkerView}>
          <TouchableOpacity
            onPress={() => {
              setMarkerListBtn(true);
            }}>
            {/* <Text style={styles.MarkerText}>
            마커
          </Text> */}
            <Image
              source={require('../assets/plus.png')}
              style={styles.MarkerImage}
            />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
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
        {startBtn ? ( //산책 시작 버튼 눌렀을때
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: 80,
              flexDirection: 'row',
              alignItems: 'center',
              alignContent: 'space-around',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                height: 80,
                marginLeft: 30,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'black',
                  height: 30,
                  marginTop: 10,
                }}>
                {distanceTravelled.toFixed(2)} km
              </Text>
              <Text style={{textAlign: 'center'}}> 거리</Text>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                height: 80,
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setResultBtn(prev => !prev);
                  setEnergyDistance(
                    distanceTravelled.toFixed(2) - firstDistance.toFixed(2),
                  );
                  stop();
                  Estop();
                  captureImage();
                }}>
                <FontAwesome
                  name="stop-circle"
                  style={{
                    fontSize: 60,
                    top: 8,
                    color: '#6A74CF',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                height: 80,
                marginRight: 30,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'black',
                  height: 30,
                  marginTop: 10,
                }}>
                {currentHours < 10 ? `0${currentHours}` : currentHours}:
                {currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}:
                {currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}
              </Text>
              <Text style={{textAlign: 'center'}}>시간</Text>
            </View>
            <View
              style={{
                // backgroundColor: energyBtn ? 'green' : 'red',
                zIndex: 1,
                position: 'absolute',
                bottom: 35,
              }}>
              {routeCoordinates.length >= 5 ? ( //거리배열이 5개 이상일때만 에너지버튼이 활성화 되도록
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      '에너지가 떨어지셨나요?',
                      '에너지 떨어짐 확인',
                      [
                        {
                          text: '확인',
                          onPress: () => {
                            setEnergyBtn(true);
                            setFirstDistance(distanceTravelled);
                            Estartcnt();
                            setEnergyCoordinates([
                              routeCoordinates[routeCoordinates.length - 1],
                            ]);
                          },
                        },
                        {
                          text: '취소',
                        },
                      ],
                    );
                  }}>
                  <FontAwesome
                    name="battery"
                    style={{
                      fontSize: 30,
                      color: energyBtn ? 'red' : 'green',
                      left: 5,
                    }}
                  />
                  {/* <Text>에너지</Text>
                <Text>떨어짐</Text> */}
                  {/* <Text>{energyBtn ? 'on' : 'off'}</Text> */}
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: '#6A74CF',
              width: '70%',
              height: 50,
              zIndex: 1,
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              borderRadius: 77,
            }}
            onPress={() => {
              setStartBtn(true);
              startcnt();
            }}>
            <Text
              style={{
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
        <View
          style={{
            backgroundColor: 'white',
            zIndex: 1,
            position: 'absolute',
            width: WIDTH,
            height: HEIGHT * 0.9, //HEIGHT * 0.7
            top: 0,
          }}>
          {/* <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                width: 40,
                height: 40,
                marginLeft: 70,
              }}
              onPress={
                captureImage
                // captureAndSave;
                // uploadImageToServer
              }>
              <Text>캡쳐</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: 'orange',
                width: 40,
                height: 40,
                marginLeft: 5,
              }}
              onPress={
                // captureImage
                // captureAndSave
                uploadImageToServer
              }>
              <Text>사진보내기</Text>
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              top: 10,
              flex: 1.2,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  marginHorizontal: 20,
                  marginBottom: 10,
                  width: '40%',
                }}>
                {year}. {month}. {day} (일)
              </Text>
              <IconRightButton
                style={styles.share}
                name="share-google"
                size={35}
                color={'black'}
                onPress={shareImage}
              />
            </View>
            <Text
              style={{
                color: 'orange',
                fontSize: 25,
                fontWeight: 'bold',
                marginLeft: 20,
                marginRight: 70,
                marginBottom: 10,
              }}>
              오늘도 열심히 산책해서 멋있어요!
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View
                style={{
                  // flexDirection: 'row',
                  flexDirection: 'column',
                  alignContent: 'space-around',
                  alignItems: 'center',
                  // alignSelf: 'center',
                  marginHorizontal: 20,
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  산책 결과:{' '}
                </Text>
                <Text style={{fontSize: 12}}>
                  거리 {distanceTravelled.toFixed(2)} km{' '}
                </Text>
                {/* <Text style={{fontSize: 12}}>처음거리 {firstDistance.toFixed(2)} km , </Text> */}
                <Text style={{fontSize: 12}}>
                  총 시간{' '}
                  {currentHours < 10 ? `0${currentHours}` : currentHours}:
                  {currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}:
                  {currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}
                  {'초'}
                </Text>
              </View>
              {energyBtn ? (
                <View
                  style={{
                    flexDirection: 'column',
                    alignContent: 'space-around',
                    alignItems: 'center',
                    // alignSelf: 'center',
                    marginHorizontal: 20,
                    marginBottom: 10,
                  }}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    체력이 떨어진 구간:{' '}
                  </Text>
                  <Text style={{fontSize: 12}}>
                    에너지 떨어진 거리 {energyDistance.toFixed(2)} km{' '}
                  </Text>
                  <Text style={{fontSize: 12}}>
                    에너지 떨어진 시간{' '}
                    {energyHours < 10 ? `0${energyHours}` : energyHours}:
                    {energyMinutes < 10 ? `0${energyMinutes}` : energyMinutes}:
                    {energySeconds < 10 ? `0${energySeconds}` : energySeconds}초
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{flex: 2}}>
            {/* <ViewShot ref={ref => (this.viewShot = ref)}> */}
            <ViewShot
              ref={viewShotRef}
              onCapture={() => resultBtn}
              options={{
                format: 'jpg',
                quality: 1.0,
                handleGLSurfaceViewOnAndroid: true,
              }}>
              <NaverMapView
                style={{
                  backgroundColor: 'red',
                  width: '90%',
                  height: 350,
                  marginHorizontal: 20,
                  marginBottom: 10,
                }}
                zoomControl={true}
                // showsMyLocationButton={true}
                center={{
                  zoom: myPosition ? 15 : 5.5,
                  //TODO: 산책 종료 후 라인 기록 센터가 현위치에 맞춰져서 라인이 짤릴 수 있음.
                  // 라인 전체를 볼 수 있도록
                  latitude: myPosition?.latitude ? myPosition?.latitude : 37,
                  longitude: myPosition?.longitude
                    ? myPosition?.longitude
                    : 127.6,
                  // latitude: myPosition?.latitude,
                  // longitude: myPosition?.longitude,
                }}>
                {hotplaceCoordinates.map((coordinate, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: coordinate.latitude,
                      longitude: coordinate.longitude,
                    }}
                    image={require('../assets/hotplace.png')}
                    width={30}
                    height={30}
                    onClick={() => {
                      const newCoordinates = hotplaceCoordinates.filter(
                        (c, i) => i !== index,
                      );
                      setHotplaceCoordinates(newCoordinates);
                    }}
                  />
                ))}

                {dangerCoordinates.map((coordinate, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: coordinate.latitude,
                      longitude: coordinate.longitude,
                    }}
                    image={require('../assets/danger.png')}
                    width={30}
                    height={30}
                    onClick={() => {
                      const newCoordinates = dangerCoordinates.filter(
                        (c, i) => i !== index,
                      );
                      setDangerCoordinates(newCoordinates);
                    }}
                  />
                ))}
                {myPosition?.latitude && (
                  <Polyline //결과 창 일반 폴리라인
                    coordinates={
                      routeCoordinates.length <= 2
                        ? [
                            {
                              latitude: myPosition.latitude,
                              longitude: myPosition.longitude,
                            },
                            {
                              latitude: myPosition.latitude,
                              longitude: myPosition.longitude,
                            },
                          ]
                        : routeCoordinates
                    }
                    strokeWidth={5}
                    strokeColor="#1EFF34"
                  />
                )}
                {myPosition?.latitude && (
                  <Polyline //결과 창 에너지 떨어짐 폴리라인
                    coordinates={
                      energyCoordinates.length <= 2
                        ? [
                            {
                              latitude: myPosition.latitude,
                              longitude: myPosition.longitude,
                            },
                            {
                              latitude: myPosition.latitude,
                              longitude: myPosition.longitude,
                            },
                          ]
                        : energyCoordinates
                    }
                    strokeWidth={5}
                    strokeColor="#F19900"
                  />
                )}
              </NaverMapView>
            </ViewShot>
            {/* <Image
              source={
                imageCapture
                  ? {uri: imageCapture}
                  : require('../assets/puppy.jpg')
              }
              style={{width: 300, height: 150}}
            /> */}
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{
                backgroundColor: '#6A74CF',
                width: '70%',
                height: 50,
                zIndex: 1,
                alignSelf: 'center',
                alignContent: 'center',
                alignItems: 'center',
                borderRadius: 77,
              }}
              // onPress={async () => {
              //   try {
              //     // await captureImage();
              //     await uploadImageToServer();
              //     setTimeout(() => {
              //       setResultBtn(false); //결과 화면 닫기
              //       setStartBtn(prev => !prev); //스타트 버튼 열기
              //       reset(); //시간초기화
              //       Ereset(); //E시간초기화
              //       setRouteCoordinates([]); //폴리라인 배열 초기화
              //       setEnergyCoordinates([]); //에너지 떨어짐 배열 초기화
              //       setDistanceTravelled(0); //측정거리 초기화
              //       setPrevLatLng(null); //이전거리 초기화
              //       setEnergyBtn(false); //에너지 떨어짐 버튼 초기화
              //       setFirstDistance(0); //측정 거리 초기화
              //       setEnergyDistance(0); //에너지 떨어짐 거리 초기화
              //     }, 1500);
              //   } catch (error) {
              //     console.error(error);
              //   }
              // }}>
              onPressIn={uploadImageToServer}
              onPress={() => {
                setResultBtn(false); //결과 화면 닫기
                setStartBtn(prev => !prev); //스타트 버튼 열기
                reset(); //시간초기화
                Ereset(); //E시간초기화
                setRouteCoordinates([]); //폴리라인 배열 초기화
                setEnergyCoordinates([]); //에너지 떨어짐 배열 초기화
                setDistanceTravelled(0); //측정거리 초기화
                setPrevLatLng(null); //이전거리 초기화
                setEnergyBtn(false); //에너지 떨어짐 버튼 초기화
                setFirstDistance(0); //측정 거리 초기화
                setEnergyDistance(0); //에너지 떨어짐 거리 초기화
              }}>
              <Text
                style={{
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
        </View>
      ) : null}
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  share: {
    alignItems: 'flex-end',
    backgroundColor: 'green',
    borderColor: 'red',
    borderWidth: 1,
  },
  MarkerView: {
    width: 60,
    height: 60,
    // backgroundColor: 'white',
    zIndex: 1,
    position: 'absolute',
    bottom: 100,
    right: 5,
    alignItems: 'center',
    borderRadius: 10,
  },
  MarkerText: {
    zIndex: 1,
    position: 'absolute',
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    top: 17,
    left: 9,
  },
  MarkerImage: {
    width: 40,
    height: 40,
    top: 10,
  },
  MarkerListView: {
    width: 180,
    height: 60,
    backgroundColor: 'white',
    zIndex: 1,
    position: 'absolute',
    bottom: 100,
    right: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 10,
  },
  MarkerListText: {
    fontSize: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});
