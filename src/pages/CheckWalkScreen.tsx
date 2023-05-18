import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
const {width: WIDTH} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

// 개별 산책 데이터 인터페이스
interface Walk {
  createdDate: string | null;
  distance: number;
  energyFinishDistance: number;
  energyFinishTime: string;
  finishTime: string;
  id: number;
  routeImage: string;
  startTime: string;
  user: object;
}

// 캘린더에서 선택된 산책기록 가져옴 {walkData}
type Props = {
  route: {
    params: {
      walkData: Walk;
    };
  };
};

// 산책 기록을 삭제하는 함수
const deleteWalkData = async (id: number, navigation) => {
  Alert.alert(
    '산책 기록 삭제',
    '해당 산책 기록이 삭제되는 것에 동의하십니까?',
    [
      {
        text: '취소',
        onPress: () => console.log('삭제 취소됨'),
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            if (token !== null) {
              const response = await axios.delete(
                `http://awsv4-env.eba-mre2mcnv.ap-northeast-2.elasticbeanstalk.com/api/walk/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (response.status === 200) {
                console.log('Walk data deleted successfully');
                // 산책 데이터 삭제 후, 리스트를 업데이트하기 위해 API 요청을 다시 실행합니다.
                // fetchData();
                navigation.goBack();
              } else {
                console.log('Failed to delete walk data');
              }
            } else {
              console.log('Token not found');
            }
          } catch (error) {
            console.log('Error deleting walk data:', error);
          }
        },
      },
    ],
    {cancelable: false},
  );
};

const CheckWalkScreen: React.FC<Props> = ({route}) => {
  const {walkData} = route.params;
  const titleMonth = walkData.startTime.slice(6, 7).replace(/^0+/, ''); // 월
  const titleDate = walkData.startTime.slice(8, 10).replace(/^0+/, ''); // 일

  const date = new Date(walkData.startTime);
  const finish = new Date(walkData.finishTime);
  const energyFinishTime = new Date(walkData.energyFinishTime);
  const diff = new Date(finish - date);
  const durationMin = Math.floor(diff / (1000 * 60)); // 몇 분
  const durationSec = Math.floor(diff / 1000 - durationMin * 60); // 몇 초

  const E_diff = new Date(energyFinishTime - date);
  const E_durationMin = Math.floor(E_diff / (1000 * 60)); // 몇 분
  const E_durationSec = Math.floor(E_diff / 1000 - E_durationMin * 60); // 몇 초

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeekName = daysOfWeek[date.getDay()]; // 요일

  const startTime = walkData.startTime.slice(11, 19);
  const finishTime = walkData.finishTime.slice(11, 19);
  const distance = walkData.distance;
  const energyFinishDistance = walkData.energyFinishDistance;

  // 달리기 페이스 계산
  const seconds = durationSec + durationMin * 60;
  const pace = seconds / distance;
  const paceMin = Math.floor(pace / 60);
  const paceSec = Math.floor(pace % 60);

  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollcontainer}
      ref={scrollViewRef}>
      <View style={styles.container1}>
        <View style={styles.titlecontainer}>
          <Text style={styles.title1}>
            {`${titleMonth}`}월 {`${titleDate}`}일
          </Text>
          <Text style={styles.title2}>{`${dayOfWeekName}`}요일 산책기록!</Text>
        </View>

        <View style={styles.imagecontainer}>
          <Image style={styles.image1} source={{uri: walkData.routeImage}} />
        </View>

        <Text style={styles.time}>
          {`${startTime}`} ~ {`${finishTime}`}
        </Text>

        <View style={styles.durationcontainer}>
          <Text style={styles.duration1}>
            {durationMin < 10 ? `0${durationMin}` : `${durationMin}`}분
          </Text>
          <Text style={styles.duration2}>{`${durationSec}`}초 동안</Text>
        </View>
        <View style={styles.distancecontainer}>
          <Text style={styles.distance1}>총 {`${distance}`}km</Text>
          <Text style={styles.distance2}>산책했어요!</Text>
          <Image
            style={styles.image2}
            source={require('../assets/check.png')}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            scrollViewRef.current.scrollTo({
              x: 0,
              y: 800,
            });
          }}>
          <Text style={styles.buttonText}>상세 기록 확인</Text>
        </TouchableOpacity>
      </View>

      {/* 두번째 화면 */}
      <View style={styles.container2}>
        <View style={styles.firstcontainer}>
          <View style={styles.devide1}>
            <Text style={styles.summaryText}>총 거리: {`${distance}`} km</Text>
            <Text style={styles.summaryText}>
              시간: {`${durationMin}`}분 {`${durationSec}`}초
            </Text>
            <Text style={styles.summaryText}>
              {`${startTime}`} - {`${finishTime}`}
            </Text>
            <Text style={styles.summaryText}>
              페이스: {`${paceMin}`}' {`${paceSec}`}''{''}
            </Text>
          </View>
          <View style={styles.imagecontainer2}>
            <Image style={styles.image3} source={{uri: walkData.routeImage}} />
          </View>
        </View>

        <View style={styles.secondcontainer}>
          <Text style={styles.energeLow1}>산책을 시작하고 </Text>

          <View style={styles.EnergeContainer1}>
            {/* <Text style={styles.energeLow2_1}>{`${E_durationMin}`}분</Text> */}
            <Text style={styles.energeLow2_1}>
              {isNaN(E_durationMin) ? ' *^^*' : ` ${E_durationMin}분`}
            </Text>
            <Text style={styles.energeLow2_2}>
              {isNaN(E_durationSec)
                ? '끝까지 기운이 넘쳤어요!!'
                : `${E_durationSec}초 후에 체력이 떨어졌어요.`}
            </Text>
          </View>

          <View style={styles.EnergeContainer2}>
            <Text style={styles.energeLow3_1}>
              {`${energyFinishDistance}`}km
            </Text>
            <Text style={styles.energeLow3_2}>를 기운차게 뛰었어요!</Text>
          </View>
        </View>

        <View style={styles.thirdcontainer}>
          <Text style={styles.month1}>이번달 산책기록!</Text>
          <Text style={styles.month2}>산책 횟수: 16회</Text>
          <Text style={styles.month2}>평균 산책 시간: 30분</Text>
          <Text style={styles.month2}>평균 산책 거리: 2.7km </Text>
          <View style={styles.button_container}>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
                scrollViewRef.current.scrollTo({
                  x: 0,
                  y: 0,
                });
              }}>
              <Text style={styles.buttonText2}>위로</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button3}
              onPress={() => deleteWalkData(walkData.id, navigation)}>
              <Text style={styles.buttonText3}>기록삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollcontainer: {
    // flex: 1, //스크롤 안되는 원인
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  container1: {
    // 한페이지 만큼의 분량
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '-4%',
  },
  titlecontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '3%',
    marginBottom: '6%',
    marginLeft: '-6%',
    flex: 1,
  },
  title1: {
    width: '40%',
    height: '100%',
    fontFamily: 'Blinker-Bold',
    fontSize: 40,
    lineHeight: 40,
    fontWeight: '900',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
  },
  title2: {
    width: '50%',
    height: '100%',
    fontFamily: 'Blinker-Bold',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 50,
    textAlign: 'left',
    color: '#000000',
    marginLeft: '-8%',
  },
  imagecontainer: {
    width: '100%',
    height: 350,
    marginTop: '-3%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    backgroundColor: '#8AA2F8',
    overflow: 'hidden',
  },

  image1: {
    width: '100%',
    height: '117%',
    borderRadius: 30,
    resizeMode: 'cover',
  },
  time: {
    width: 200,
    height: 30,
    fontFamily: 'Blinker-SemiBold',
    fontSize: 25,
    lineHeight: 40,
    fontWeight: '600',
    textAlign: 'left',
    color: '#000000',
    marginLeft: '-40%',
    marginTop: '10%',
  },
  durationcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: '-18%',
  },
  duration1: {
    fontSize: 50,
    width: '20%',
    height: '100%',
    lineHeight: 60,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
    // backgroundColor: '#8AA2F8',
  },
  duration2: {
    fontSize: 30,
    width: '46%',
    height: '100%',
    lineHeight: 70,
    fontFamily: 'Blinker-Bold',
    fontWeight: '800',
    textAlign: 'left',
    color: '#000000',
    // backgroundColor: '#FFFF00',
  },
  distancecontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
  },
  distance1: {
    fontSize: 50,
    width: 180,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
  },
  distance2: {
    fontSize: 30,
    width: 200,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '800',
    // fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
  },
  button: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 80,
  },
  buttonText: {
    backgroundColor: '#8AA2F8',
    width: WIDTH * 0.35,

    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Blinker-Bold',
    fontSize: 17,
    fontWeight: 'bold',
    borderRadius: 77,
  },
  image2: {
    width: 50,
    height: 50,
    marginLeft: -80,
    marginBottom: '10%',
  },
  container2: {
    // 한페이지 만큼의 분량
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '34%',
  },
  firstcontainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: '20%',
  },
  devide1: {width: '50%'},
  summaryText: {
    width: '100%',
    height: '25%',
    fontFamily: 'Blinker-SemiBold',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 20,
    textAlign: 'right',
    color: '#8AA2F8',
  },
  imagecontainer2: {
    width: '50%',
    height: '250%',
    marginLeft: '5%',
    marginRight: '5%',
    elevation: 8,
    backgroundColor: '#8AA2F8',
    borderRadius: 30,
    overflow: 'hidden',
  },
  image3: {width: '133%', height: '150%'},

  secondcontainer: {flex: 1, marginBottom: 50},
  energeLow1: {
    fontSize: 28,
    width: 400,
    height: 40,
    lineHeight: 30,
    fontFamily: 'Blinker-Bold',
    fontWeight: '400',
    textAlign: 'left',
    color: '#000000',
    marginLeft: 150,
  },
  EnergeContainer1: {flexDirection: 'row'},
  energeLow2_1: {
    fontSize: 50,
    width: 140,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
    marginLeft: 150,
  },
  energeLow2_2: {
    fontSize: 28,
    width: 400,
    height: 40,
    lineHeight: 61,
    fontFamily: 'Blinker-SemiBold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#000000',
    marginLeft: -55,
  },
  EnergeContainer2: {flexDirection: 'row'},
  energeLow3_1: {
    fontSize: 50,
    width: 140,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#000000',
    marginLeft: 150,
  },
  energeLow3_2: {
    fontSize: 28,
    width: 400,
    height: 40,
    lineHeight: 55,
    fontFamily: 'Blinker-SemiBold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#000000',
    // marginLeft: -15,
  },

  thirdcontainer: {flex: 1, marginBottom: '20%'},
  month1: {
    fontSize: 40,
    width: 400,
    height: 55,
    lineHeight: 50,
    fontFamily: 'Blinker-Bold',
    fontWeight: '400',
    textAlign: 'left',
    color: '#8AA2F8',
    marginLeft: 30,
  },
  month2: {
    fontSize: 28,
    width: 400,
    height: 30,
    lineHeight: 30,
    fontFamily: 'Blinker-SemiBold',
    fontWeight: '900',
    textAlign: 'left',
    color: '#8AA2F8',
    marginLeft: 40,
  },
  button2: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 80,
  },
  buttonText2: {
    backgroundColor: '#8AA2F8',
    width: WIDTH * 0.2,

    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Blinker-Bold',
    fontSize: 17,
    fontWeight: 'bold',
    borderRadius: 77,
  },
  button3: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 80,
    marginHorizontal: 10,
  },
  buttonText3: {
    backgroundColor: '#FF4848',
    width: WIDTH * 0.2,

    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Blinker-Bold',
    fontSize: 17,
    fontWeight: 'bold',
    borderRadius: 77,
  },
  button_container: {
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default CheckWalkScreen;
