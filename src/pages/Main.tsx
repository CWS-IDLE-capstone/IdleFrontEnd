import Geolocation from '@react-native-community/geolocation';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  Share,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
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
import NaverMapView, {Marker, Polyline, Path} from 'react-native-nmap';
import {LoggedInParamList} from '../../AppInner';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import DaonBtn from '../components/daonBtn';
import geolibGetDistance from 'geolib/es/getDistance';
interface CoordinateLongitudeLatitude {
  latitude: number;
  longitude: number;
}

interface CoordinateCamMarker {
  latitude: number;
  longitude: number;
  uri: string;
  isLarge: boolean;
}

// type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
// type MainScreenProps = NativeStackScreenProps<LoggedInParamList, 'Community'>;
const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
console.log('------'); //const { count, startcnt, stop, reset} = useCounter(0, 1000);
function Main({setIsTabVisible}: any) {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [myCamPosition, setMyCamPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //기본 배열
  const [energyCoordinates, setEnergyCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //에너지 떨어짐 배열
  const [allCoordinates, setAllCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //합친 배열
  const [hotplaceCoordinates, setHotplaceCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //핫플 마커 배열
  const [dangerCoordinates, setDangerCoordinates] = useState<
    CoordinateLongitudeLatitude[]
  >([]); //주의 마커 배열
  const [camCoordinates, setCamCoordinates] = useState<
    CoordinateLongitudeLatitude[] | CoordinateCamMarker[]
  >([]); //카메라 마커 배열

  const [camResponse, setCamResponse] = useState(null);
  const [camdogBtn, setCamdogBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMediumLoading, setIsMediumLoading] = useState(false);
  const [mediumLatitude, setMediumLatitude] = useState<number>(0);
  const [mediumLongitude, setMediumLongitude] = useState<number>(0);

  const [distanceTravelled, setDistanceTravelled] = useState<number>(0); //거리
  const [firstDistance, setFirstDistance] = useState<number>(0); //측정 거리
  const [energyDistance, setEnergyDistance] = useState<Number>(0); //에너지 떨어짐 거리

  const [prevLatLng, setPrevLatLng] =
    useState<CoordinateLongitudeLatitude | null>(null);

  const [startBtn, setStartBtn] = useState(false); //산책 시작 버튼 state
  const [resultBtn, setResultBtn] = useState(false); //결과창 실행 버튼 state
  const [energyBtn, setEnergyBtn] = useState(false); //에너지 떨어짐 버튼 state
  const [markerListBtn, setMarkerListBtn] = useState(false); //마커 리스트 버튼 state
  const [hotMarkerBtn, setHotMarkerBtn] = useState(false); //핫플 마커 버튼 state
  const [dangerMarkerBtn, setDangerMarkerBtn] = useState(false); //주의 마커 버튼 state
  const [camMarkerBtn, setCamMarkerBtn] = useState(false); //카메라 마커 버튼 state
  const [camBackBtn, setCamBackBtn] = useState(false); //카메라 마커 뒤로가기 버튼 state
  const [camDeleteBtn, setCamDeleteBtn] = useState(false); //카메라 사진 삭제 버튼 state

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

  // const [imageCapture, setImageCapture] = useState(null); //이미지 캡쳐 후 화면표시용
  const [imageCaptureUrl, setImageCaptureUrl] = useState('');
  const [distance, setDistance] = useState<number>(0);
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [energyFinishTime, setEnergyFinishTime] = useState('');
  const [energyFinishDistance, setEnergyFinishDistance] = useState<number>(0);
  const offset = today.getTimezoneOffset() * 60000;
  const nowKr = new Date(today.getTime() - offset); //한국 시간 적용
  const now = nowKr.toISOString();
  const [captureCheck, setCaptureCheck] = useState(false);

  const setTabVisible = (tF: boolean) => {
    //하단 탭 true,false설정
    setIsTabVisible(tF);
  };
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newCoordinate: CoordinateLongitudeLatitude = {
          latitude,
          longitude,
        };
        setMyPosition(newCoordinate);
        // setRouteCoordinates(prev => [...prev, newCoordinate]);
        camMarkerBtn
          ? setCamCoordinates(prev => [...prev, newCoordinate])
          : null;
        // setRouteCoordinates([newCoordinate]); //처음위치를 무조건 배열에 안넣고 산책시작하면 배열에 넣게 없앴음
        // setPrevLatLng(null);
        console.log('getCurrentPosition 실행');
        // console.log(typeof(today.toISOString()));
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 3000,
        distanceFilter: 50,
      },
    );
  }, [camMarkerBtn]);
  // console.log(`시간: ${typeof(today.getHours().toString())}, 분: ${today.getMinutes()}`);
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
        // startBtn
        //   ? energyBtn
        //     ? setAllCoordinates([...routeCoordinates, ...energyCoordinates])
        //     : setAllCoordinates([...routeCoordinates])
        //   : null;
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
  const onLaunchCamera = useCallback(() => {
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
        setCamCoordinates(prevCoordinates =>
          prevCoordinates.map((coordinate, index) =>
            index === prevCoordinates.length - 1
              ? {...coordinate, isLarge: false}
              : coordinate,
          ),
        );
        setCamCoordinates(prevCoordinates =>
          prevCoordinates.map((coordinate, index) =>
            index === prevCoordinates.length - 1
              ? {...coordinate, uri: res.assets[0].uri}
              : coordinate,
          ),
        );
        setCamMarkerBtn(false);
        // // const uri = res.assets[0].uri;
        // camCoordinates.forEach((coordinate, index) => {
        //   // const response = res;
        //   const uri = res.assets[0].uri;
        //   Object.assign(coordinate, {uri});
        //   // setCamCoordinates(Object);
        // });
        // setCamMarkerBtn(false);
        // // setCamResponse(res); //이미지 보낼때 이거 쓰면 될거같음
        // // console.log(`res: ${res.assets[0].uri}`);
      },
    );
  }, []);

  const mediumLatitudefunc = useCallback(allCoordinates => {
    const routelatitudes = allCoordinates.map(coord => coord.latitude);
    const allMaxLatitude = Math.max(...routelatitudes);
    const allMinxLatitude = Math.min(...routelatitudes);
    const result = (allMaxLatitude + allMinxLatitude) / 2;
    return result;
  }, []);

  const mediumLongitudefunc = useCallback(allCoordinates => {
    const routelongitudes = allCoordinates.map(coord => coord.longitude);
    const allMaxLongitude = Math.max(...routelongitudes);
    const allMinxLongitude = Math.min(...routelongitudes);
    const result = (allMaxLongitude + allMinxLongitude) / 2;
    return result;
  }, []);

  useEffect(timer, [count]);
  useEffect(Etimer, [Ecount]);

  // console.log('거리: ', distanceTravelled.toFixed(2), 'km');
  // console.log(`accessToken: ${accessToken}`);
  // console.log(`distance: ${distance}`);
  // console.log(`startTime: ${startTime}`);
  // console.log(`finsihTime: ${finishTime}`);
  // console.log(`energyFinsihTime: ${energyFinishTime}`);
  // console.log(`energyFinishDistance: ${energyFinishDistance}`);
  // console.log('카메라 마커 배열', camCoordinates);
  console.log('일반 배열: ', routeCoordinates);
  console.log('allcoordinates: ', allCoordinates);
  console.log('medium: ', mediumLatitude, mediumLongitude);
  // console.log('에너지 떨어짐 배열: ', energyCoordinates);
  // console.log(`count: ${count}, Ecount: ${Ecount}`);
  // console.log(
  //   `currentSeconds: ${currentSeconds}, energySeconds: ${energySeconds}`,
  // );

  // if ((mediumLatitude && mediumLongitude) !== null) {
  //   const mydistance1 = geolib.getDistance(
  //     {
  //       latitude: allCoordinates[0].latitude,
  //       longitude: allCoordinates[0].longitude,
  //     },
  //     {latitude: mediumLatitude, longitude: mediumLongitude},
  //   );
  //   setMydistance(mydistance1);
  //   console.log('mydistance : @@@@@@            &&&:' + mydistance);
  // }

  // if (!allCoordinates && mediumLatitude !== 0 && mediumLongitude !== 0) {
  // useEffect(() => {
  console.log('11111111 mediumLatitude : ', mediumLatitude);
  console.log('22222222 mediumLongitude : ', mediumLongitude);
  const [mydistance, setMydistance] = useState<Number | null>(null);

  // useEffect(() => {
  // if (allCoordinates.length !== 0) {
  // function workDistance(){
  // const getMyDistance = () => {
  // const mydistance1 = useCallback(() => {
  //   geolibGetDistance(
  //     {
  //       latitude: allCoordinates[0].latitude,
  //       longitude: allCoordinates[0].longitude,
  //     },
  //     {latitude: mediumLatitude, longitude: mediumLongitude},
  //   );
  console.log('@@@@@@@@@ mediumLatitude : ', mediumLatitude);
  console.log('@@@@@@@@@ mediumLongitude : ', mediumLongitude);
  // setMydistance(mydistance1);
  // return mydistance1;
  // });
  // };
  // useEffect(() => {
  //   mydistance1();
  // }, [mediumLatitude, mediumLongitude]);
  // return getMyDistance;
  // }
  // }
  // }, [allCoordinates, mediumLatitude, mediumLongitude]);
  // }
  // const getMyDistance = useCallback(() => {
  // function getMyDistance() {
  //   if (allCoordinates.length === 0) {
  //     console.log('allCoordinates.length === 0');
  //     return;
  //   }
  //   if (allCoordinates.length !== 0) {
  //     console.log('allCoordinates.length !== 0');
  //     const point1 = {
  //       latitude: allCoordinates[0].latitude,
  //       longitude: allCoordinates[0].longitude,
  //     };
  //     console.log('point1: ', point1);
  //     console.log('point1: ', point1.latitude);
  //     console.log('point1: ', point1.longitude);
  //     console.log('point2 typeof: ', typeof point1);
  //     console.log('point2 typeof: ', typeof allCoordinates[0].latitude);

  //     const point2 = {
  //       latitude: mediumLatitude,
  //       longitude: mediumLongitude,
  //       // latitude: 37.50722714216133,
  //       // longitude: 127.67020313663637,
  //     };
  //     console.log('point2: ', point2);
  //     console.log('point2 typeof: ', typeof point2);
  //     console.log('point2 typeof: ', typeof point2.latitude);

  //     // const mydistance1 = geolib.getDistance(point1, point2, 1);
  //     // setMydistance(mydistance1);
  //     console.log('@@@@@@@@@ mediumLatitude : ', mediumLatitude);
  //     console.log('@@@@@@@@@ mediumLongitude : ', mediumLongitude);
  //     console.log('mydistance : @@@@@@            &&&:' + mydistance);
  //     console.log('you are ', geolibGetDistance(point1, point2), 'Meter');
  //     const mds = geolibGetDistance(point1, point2);
  //     // console.log(
  //     //   'you are ',
  //     //   geolibGetDistance(
  //     //     {
  //     //       latitude: 37.4068,
  //     //       longitude: 126.6705,
  //     //     },
  //     //     {
  //     //       latitude: 37.5072,
  //     //       longitude: 127.6702,
  //     //     },
  //     //     1,
  //     //   ),
  //     //   'Meter',
  //     // );
  //     // return mydistance1;
  //     return setMydistance(mds);
  //   } else {
  //     console.log('allCoordinates.length ??? 0 ');
  //   }
  // }

  function getmydis() {
    // useEffect(() => {
    if (allCoordinates.length > 0) {
      console.log('allCoordinates.length > 0인 상태');
      getMyDistance();
      // setMydistance(mymymym());
      console.log('mydistance: ', mydistance);
      return mydistance;
    }
    // }, [allCoordinates, getMyDistance]);
  }
  function captureImage() {
    setTimeout(async () => {
      const imageUri = await viewShotRef.current.capture();
      console.log(imageUri);
      try {
        setImageCaptureUrl(imageUri); //imageCaptureUrl에 저장 후 이미지 업로드
        console.log('산책캡쳐완료');
        setCaptureCheck(true);
      } catch (error) {
        console.log(error);
      }
    }, 1500);
  }

  // const shareImage = async () => {
  //   try {
  //     const uri = await captureRef(viewShotRef, {
  //       format: 'jpg',
  //       quality: 0.8,
  //     });
  //     // const base64Data = await RNFetchBlob.fs.readFile(imageCapture, 'base64');
  //     const url = `data:image/png;base64,${uri}`;
  //     await Share.share({
  //       title: 'walk image',
  //       message: '',
  //       url: `${uploadImageToServer.formData._parts[0].uri}`,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  async function uploadImageToServer() {
    //캡쳐 이미지 전송
    console.log('uploadImageToServer 동작');
    try {
      const formData = new FormData();
      formData.append('images', {
        // key: 'images',
        uri: imageCaptureUrl,
        type: 'image/jpg',
        name: 'capturedTestaImage.jpg',
      });
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios
        .post(`${Config.API_URL}/api/image`, formData, config)
        .then(res => {
          console.log('res저장 : ');
          console.log(res);
          console.log('image uploaded successfully @');
          return res.data.imageUrl;
        });
      return response; //이미지 반환
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }
  async function WalkDataToServer(getImageUrl: string) {
    // 이미지 업로드 후 산책 정보 전송
    console.log('WalkDataToServer 동작');
    const data = {
      routeImage: getImageUrl,
      distance: distance,
      startTime: startTime,
      finishTime: finishTime,
      energyFinishTime: energyFinishTime,
      energyFinishDistance: energyFinishDistance,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await axios.post(
        `${Config.API_URL}/api/walk`,
        data,
        config,
      );
      console.log('data uploaded successfully #');
      console.log(data);
    } catch (error) {
      console.error('Failed to upload data:', error);
    }
  }
  async function getImageAndSendData() {
    try {
      const getImageUrl = uploadImageToServer();
      WalkDataToServer(await getImageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }
  return (
    <View style={styles.naverMap}>
      <NaverMapView
        style={{width: '100%', height: '100%', paddingBottom: 100}}
        zoomControl={true}
        showsMyLocationButton={true}
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
          console.log(newCoordinate);
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
        {camCoordinates.map(
          (camcoordinate, index) =>
            camcoordinate.uri && (
              <Marker
                key={index}
                coordinate={{
                  latitude: camcoordinate.latitude,
                  longitude: camcoordinate.longitude,
                }}
                // image={
                //   camcoordinate.isLarge
                //     ? {uri: camcoordinate.uri}
                //     : require('../assets/camera.png')
                // }
                width={camcoordinate.isLarge ? 200 : 80}
                height={camcoordinate.isLarge ? 200 : 80}
                // width={50}
                // height={50}
                // TODO 마커 리스트에 사진 삭제 버튼 하나 추가해서 사진 삭제 버튼 누르고(사진 삭제 state 활성화) 사진 마커를 클릭할시 삭제하게끔
                onClick={() => {
                  if (camDeleteBtn) {
                    Alert.alert(
                      '마커를 삭제하시겠습니까?',
                      '마커 삭제 확인 확인',
                      [
                        {
                          text: '확인',
                          onPress: () => {
                            const newCoordinates = camCoordinates.filter(
                              (c, i) => i !== index,
                            );
                            setCamCoordinates(newCoordinates);
                            setCamDeleteBtn(false);
                          },
                        },
                        {
                          text: '취소',
                        },
                      ],
                    );
                  } else {
                    setCamCoordinates(prev => {
                      const newCoordinates = [...prev];
                      newCoordinates[index].isLarge = !camcoordinate.isLarge;
                      return newCoordinates;
                    });
                  }
                }}>
                <View
                  style={{
                    width: camcoordinate.isLarge ? 200 : 80,
                    height: camcoordinate.isLarge ? 200 : 80,
                    backgroundColor: camcoordinate.isLarge
                      ? // ? '#B6E59E'
                        // : '#B6E59E',
                        '#B6E59E'
                      : '#B6E59E',
                    borderRadius: camcoordinate.isLarge ? 20 : 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: camcoordinate.isLarge ? 2 : 1,
                    borderColor: '#A0B993',
                    borderStyle: 'solid',
                  }}>
                  {!camcoordinate.isLarge && (
                    <Image
                      source={{uri: camcoordinate.uri}}
                      style={{
                        width: '90%',
                        height: '90%',
                        alignContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: '#D9F3CC',
                      }}
                    />
                  )}
                  {camcoordinate.isLarge && (
                    <Image
                      source={{uri: camcoordinate.uri}}
                      style={{
                        width: '94%',
                        height: '94%',
                        borderRadius: 13,
                        borderWidth: 2,
                        borderColor: '#D9F3CC',
                      }}
                      onLoad={prev => setIsLoading(!prev)}
                    />
                  )}

                  {camDeleteBtn ? (
                    <TouchableOpacity
                      style={{
                        // backgroundColor: 'yellow',
                        width: 10,
                        height: 10,
                        position: 'absolute',
                        top: 0,
                        right: camcoordinate.isLarge ? 10 : 0,
                      }}>
                      <View>
                        <Image
                          source={require('../assets/delete.png')}
                          style={{
                            width: camcoordinate.isLarge ? 20 : 10,
                            height: camcoordinate.isLarge ? 20 : 10,
                            position: 'absolute',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </Marker>
            ),
        )}
        {hotplaceCoordinates.map((coordinate, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            }}
            image={require('../assets/hotplace.png')}
            width={40}
            height={40}
            onClick={() => {
              Alert.alert('마커를 삭제하시겠습니까?', '마커 삭제 확인 확인', [
                {
                  text: '확인',
                  onPress: () => {
                    const newCoordinates = hotplaceCoordinates.filter(
                      (c, i) => i !== index,
                    );
                    setHotplaceCoordinates(newCoordinates);
                  },
                },
                {
                  text: '취소',
                },
              ]);
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
            width={40}
            height={40}
            onClick={() => {
              Alert.alert('마커를 삭제하시겠습니까?', '마커 삭제 확인 확인', [
                {
                  text: '확인',
                  onPress: () => {
                    const newCoordinates = dangerCoordinates.filter(
                      (c, i) => i !== index,
                    );
                    setDangerCoordinates(newCoordinates);
                  },
                },
                {
                  text: '취소',
                },
              ]);
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
            <Path //일반 path
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
              width={15}
              color="#8AA2F8"
              outlineColor="white"
              // outlineWidth={3}
              pattern={require('../assets/Rectangle207.png')}
              patternInterval={17}
            />
          ) : null)}
        {myPosition?.latitude &&
          (energyBtn ? (
            <Path //에너지 떨어짐 path
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
              width={15}
              color="#F8C2C2"
              outlineColor="white"
              // outlineWidth={3}
              pattern={require('../assets/Rectangle207.png')}
              patternInterval={17}
            />
          ) : null)}
      </NaverMapView>
      {camdogBtn ? (
        <View
          style={{
            backgroundColor: 'white',
            width: '70%',
            height: '50%',
            zIndex: 1,
            position: 'absolute',
            alignContent: 'center',
            alignSelf: 'center',
            top: '20%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setCamdogBtn(false);
            }}>
            <Image
              source={require('../assets/dogwalk.jpg')}
              style={{
                width: 260,
                height: 260,
              }}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      {markerListBtn ? (
        <>
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
                setCamMarkerBtn(true);
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
            <TouchableOpacity
              onPress={() => {
                setCamDeleteBtn(true);
                setMarkerListBtn(false);
              }}>
              <View>
                <Image
                  source={require('../assets/delete.png')}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                />
                <Text style={styles.MarkerListText}>포토마커삭제</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.MarkerView}>
            <TouchableOpacity
              onPress={() => {
                setMarkerListBtn(false);
              }}>
              <Ionicons name="list" style={styles.MarkerImage} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.MarkerView}>
          <TouchableOpacity
            onPress={() => {
              setMarkerListBtn(true);
            }}>
            <Ionicons name="list" style={styles.MarkerImage} />
          </TouchableOpacity>
        </View>
      )}
      <View
        style={[
          styles.walkControler,
          {backgroundColor: startBtn ? 'white' : 'rgba(255, 255, 255, 0)'},
          {borderColor: startBtn ? '#8AA2F8' : 'rgba(255, 255, 255, 0)'},
        ]}>
        {startBtn ? ( //산책 시작 버튼 눌렀을때
          <>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  flex: 1,
                }}>
                <View style={styles.walkcomp}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 40,
                      fontFamily: 'ConcertOne-Regular',
                      color: 'black',
                    }}>
                    {distanceTravelled.toFixed(2)}
                  </Text>
                  <Text
                    style={{
                      textAlignVertical: 'bottom',
                      fontSize: 15,
                      fontFamily: 'Blinker-Bold',
                      color: 'black',
                    }}>
                    km
                  </Text>
                </View>
                <Text
                  style={{textAlign: 'center', color: 'black', fontSize: 13}}>
                  산책거리
                </Text>
              </View>
              <View
                style={{
                  width: 100,
                  alignItems: 'center',
                  shadowColor: 'black',
                }}>
                <TouchableOpacity
                  //일시정지버튼
                  disabled={routeCoordinates.length === 0 ? true : false}
                  onPressIn={() => {
                    setResultBtn(prev => !prev);
                    setEnergyDistance(
                      parseFloat(distanceTravelled.toFixed(2)) -
                        parseFloat(firstDistance.toFixed(2)),
                    );
                    stop();
                    Estop();
                    // captureImage();
                    setDistance(parseFloat(distanceTravelled.toFixed(2)));
                    setFinishTime(now);
                    setEnergyFinishDistance(
                      parseFloat(
                        (
                          parseFloat(distanceTravelled.toFixed(2)) -
                          parseFloat(firstDistance.toFixed(2))
                        ).toFixed(2),
                      ),
                    );
                    setAllCoordinates([
                      ...routeCoordinates,
                      ...energyCoordinates,
                    ]);
                    // setMediumLatitude(mediumLatitudefunc(allCoordinates));
                    // setMediumLongitude(mediumLongitudefunc(allCoordinates));
                    // setIsMediumLoading(true);
                    // console.log('allcoordinates: ', allCoordinates);
                  }}
                  onPress={() => {
                    setMediumLatitude(mediumLatitudefunc(allCoordinates));
                    setMediumLongitude(mediumLongitudefunc(allCoordinates));
                  }}
                  onPressOut={() => {
                    captureImage();
                  }}>
                  <Feather
                    name="pause-circle"
                    style={{
                      fontSize: 70,
                      top: 8,
                      color: '#8AA2F8',
                    }}
                  />
                  {/* <AntDesign
                    name="playcircleo"
                    style={{
                      fontSize: 50,
                      top: 8,
                      color: '#8AA2F8',
                    }}
                  /> */}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 40,
                    fontFamily: 'ConcertOne-Regular',
                    color: 'black',
                    // @@@@
                    // TODO: Hourts 나왔을때 폰트 크기 조정 필요
                  }}>
                  {currentHours < 10 ? '' : currentHours + ':'}
                  {currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}:
                  {currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'black',
                  }}>
                  산책시간
                </Text>
              </View>
              <View
                style={{
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
                              setEnergyFinishTime(now);
                            },
                          },
                          {
                            text: '취소',
                          },
                        ],
                      );
                    }}
                  />
                ) : null}
              </View>
            </View>
            {/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@아래부분은2222번쨰라인 */}
            <View
              style={{
                width: '100%',
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              {/* <View style={{flexDirection: 'row'}}> */}
              <View
                style={{
                  zIndex: 1,
                  // width: 100,
                  flex: 1,
                  alignItems: 'center',
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
                              setEnergyFinishTime(now);
                            },
                          },
                          {
                            text: '취소',
                          },
                        ],
                      );
                    }}>
                    <Ionicons
                      name="ios-battery-full-sharp"
                      style={{
                        fontSize: 40,
                        color: energyBtn ? '#FFAEC9' : '#8AA2F8',
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <Ionicons
                    name="ios-battery-half-sharp"
                    style={{
                      fontSize: 40,
                      color: energyBtn ? '#FFAEC9' : '#FFAEC9',
                    }}
                  />
                )}
              </View>
              {/* </View> */}
              <TouchableWithoutFeedback>
                <View
                  style={{
                    width: 100,
                    alignItems: 'center',
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                  }}>
                  <TouchableOpacity
                    //정지버튼
                    disabled={routeCoordinates.length === 0 ? true : false}
                    onPressIn={() => {
                      setResultBtn(prev => !prev);
                      setEnergyDistance(
                        parseFloat(distanceTravelled.toFixed(2)) -
                          parseFloat(firstDistance.toFixed(2)),
                      );
                      stop();
                      Estop();
                      // captureImage();
                      setDistance(parseFloat(distanceTravelled.toFixed(2)));
                      setFinishTime(now);
                      setEnergyFinishDistance(
                        parseFloat(
                          (
                            parseFloat(distanceTravelled.toFixed(2)) -
                            parseFloat(firstDistance.toFixed(2))
                          ).toFixed(2),
                        ),
                      );
                      setAllCoordinates([
                        ...routeCoordinates,
                        ...energyCoordinates,
                      ]);
                      // setMediumLatitude(mediumLatitudefunc(allCoordinates));
                      // setMediumLongitude(mediumLongitudefunc(allCoordinates));
                      // setIsMediumLoading(true);
                      // console.log('allcoordinates: ', allCoordinates);
                    }}
                    onPress={() => {
                      setMediumLatitude(mediumLatitudefunc(allCoordinates));
                      setMediumLongitude(mediumLongitudefunc(allCoordinates));
                    }}
                    onPressOut={() => {
                      captureImage();

                      // getmydis();
                      // setMydistance(getMyDistance());
                      // setMydistance(mydistance1());
                      console.log(mydistance);

                      // setMydistance(getMyDistance());
                    }}>
                    <Ionicons
                      name="stop-circle-outline"
                      style={{
                        fontSize: 50,
                        // top: 8,
                        color: '#8AA2F8',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}>
                <TouchableOpacity disabled={true}>
                  <Ionicons name="list" style={styles.MarkerImage1} />
                </TouchableOpacity>
              </View>
            </View>
            {/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  위에는2222번쨰 */}
          </>
        ) : (
          <DaonBtn
            text="산책 시작하기"
            touchableStyle={styles.loginTouchBtn}
            style={styles.loginBtn}
            activeOpacity={0.6}
            onPress={() => {
              setStartBtn(true);
              startcnt();
              setStartTime(now);
              setTabVisible(false);
            }}
          />
        )}
      </View>
      {resultBtn ? (
        <View
          style={{
            backgroundColor: 'white',
            zIndex: 1,
            position: 'absolute',
            width: WIDTH,
            height: HEIGHT * 0.81,
            top: 0,
          }}>
          <View
            style={{
              top: 15,
              flex: 0.8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{
                    color: 'orange',
                    fontSize: 25,
                    fontFamily: 'ConcertOne-Regular',
                    fontWeight: 'bold',
                    marginLeft: 20,
                    marginRight: 70,
                  }}>
                  오늘도 열심히 산책해서
                </Text>
                <Text
                  style={{
                    color: 'orange',
                    fontSize: 25,
                    fontFamily: 'ConcertOne-Regular',
                    fontWeight: 'bold',
                    marginLeft: 20,
                    marginRight: 70,
                    marginBottom: 10,
                  }}>
                  멋있어요!
                </Text>
              </View>
              <IconRightButton
                style={styles.share}
                name="share-google"
                size={35}
                color={'white'}
              />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'ConcertOne-Regular',
                marginHorizontal: 20,
                width: '40%',
                color: 'slategray',
              }}>
              {year}. {month}. {day} (일)
            </Text>
          </View>
          <View style={{flex: 1.8}}>
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
                  width: '90%',
                  // height: 350,
                  height: HEIGHT * 0.4,
                  marginHorizontal: 20,
                  marginBottom: 10,
                }}
                zoomControl={true}
                // showsMyLocationButton={true}
                center={{
                  zoom: myPosition ? 13.8 : 5.5,
                  //TODO: 산책 종료 후 라인 기록 센터가 현위치에 맞춰져서 라인이 짤릴 수 있음.
                  // 라인 전체를 볼 수 있도록
                  latitude: myPosition?.latitude ? mediumLatitude : 37,
                  longitude: myPosition?.longitude ? mediumLongitude : 127.6,
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
                  />
                ))}
                {myPosition?.latitude && (
                  <Path //결과창 일반 path
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
                    width={15}
                    color="#8AA2F8"
                    outlineColor="white"
                    // outlineWidth={3}
                    pattern={require('../assets/Rectangle207.png')}
                    patternInterval={17}
                  />
                )}
                {myPosition?.latitude && (
                  <Path //결과창 에너지 떨어짐 path
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
                    width={15}
                    color="#F8C2C2"
                    outlineColor="white"
                    // outlineWidth={3}
                    pattern={require('../assets/Rectangle207.png')}
                    patternInterval={17}
                  />
                )}
              </NaverMapView>
            </ViewShot>
          </View>
          <View style={{flex: 1}}>
            {captureCheck ? (
              <TouchableOpacity
                style={{
                  backgroundColor: '#8AA2F8',
                  width: '70%',
                  height: 50,
                  zIndex: 1,
                  alignSelf: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  borderRadius: 13,
                  marginTop: '5%',
                }}
                onPressIn={async () => {
                  await getImageAndSendData();
                }}
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
                  setDistance(0);
                  setStartTime('');
                  setFinishTime('');
                  setEnergyFinishTime('');
                  setEnergyFinishDistance(0);
                  setCaptureCheck(false);
                  setTabVisible(true);
                  setAllCoordinates([]);
                  // setCamCoordinates([]); //카메라 마커 배열 초기화
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
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  loginTouchBtn: {
    marginTop: 30,
    width: '70%',
    alignSelf: 'center',
  },
  loginBtn: {
    height: 50,
    borderRadius: 12,
  },
  walkcomp: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  naverMap: {
    flex: 1,
  },
  share: {
    alignItems: 'flex-end',
    backgroundColor: 'green',
    borderColor: 'red',
    borderWidth: 1,
  },
  walkControler: {
    flexDirection: 'column',
    width: '100%',
    height: HEIGHT * 0.2,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'absolute',
    bottom: -2,
    zIndex: 2,
  },
  MarkerView: {
    width: 60,
    height: 60,
    // backgroundColor: 'white',
    zIndex: 3,
    position: 'absolute',
    bottom: 0,
    right: 40,
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
    fontSize: 40,
    top: 10,
    marginRight: 10,
    // color: '#8AA2F8',
    color: 'black',
    opacity: 0.5,
  },
  MarkerImage1: {},
  MarkerListView: {
    width: 240,
    height: 60,
    backgroundColor: '#FFFFFF50',
    zIndex: 1,
    position: 'absolute',
    bottom: HEIGHT * 0.21,
    right: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  MarkerListText: {
    fontSize: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'black',
  },
  okBtn: {
    zIndex: 1,
    borderRadius: 10,
    alignSelf: 'center',
    width: '70%',
  },
  okTouchBtn: {
    marginTop: HEIGHT * 0.04,
  },
});
