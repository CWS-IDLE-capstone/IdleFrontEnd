import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');

function Community() {
  const [camCoordinates, setCamCoordinates] = useState<
    CoordinateLongitudeLatitude[] | CoordinateCamMarker[]
  >([]);
  const [bigImgbtn, setBigImgbtn] = useState(false);
  const [bigImg, setBigImg] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCamCoordinates = async () => {
      try {
        const camCoordinatesString = await AsyncStorage.getItem(
          'camCoordinates',
        );
        if (camCoordinatesString !== null) {
          setCamCoordinates(JSON.parse(camCoordinatesString));
        }
        console.log('getItem Success');
        console.log(camCoordinates);
      } catch (error) {
        console.log(error);
      }
    };

    getCamCoordinates();
  }, []);

  const getCamCoordinates = async () => {
    try {
      const camCoordinatesString = await AsyncStorage.getItem('camCoordinates');
      if (camCoordinatesString !== null) {
        setCamCoordinates(JSON.parse(camCoordinatesString));
      }
      console.log('getItem Success');
      console.log(camCoordinates);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(prev => !prev);
    setTimeout(() => {
      setRefreshing(false);
      getCamCoordinates();
    }, 1000); // 새로고침이 완료될 때까지 기다리는 시간 (1초)
  };

  return (
    <View>
      <ScrollView
        style={{width: WIDTH, height: HEIGHT}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          {camCoordinates.map((coord, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setBigImgbtn(true);
                setBigImg(coord.uri);
              }}
              // onPressOut={() => setBigImgbtn(false)}
              style={{padding: 1, width: '33.33%'}}>
              <Image
                source={{uri: coord.uri}}
                style={{
                  width: '100%',
                  height: 150,
                }}
                onLoad={prev => setIsLoading(!prev)}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {bigImgbtn ? (
        <View style={styles.bigImgView}>
          <TouchableOpacity
            style={styles.bigImg}
            onPress={() => setBigImgbtn(false)}>
            <Image
              source={{uri: bigImg}}
              style={styles.bigImg}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 40,
  },
  bigImg: {
    width: '98%',
    height: '98%',
    position: 'absolute',
    alignContent: 'center',
    alignSelf: 'center',
    top: 5,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  bigImgView: {
    width: WIDTH * 0.95,
    height: HEIGHT * 0.6,
    position: 'absolute',
    alignContent: 'center',
    alignSelf: 'center',
    top: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
});
export default Community;
