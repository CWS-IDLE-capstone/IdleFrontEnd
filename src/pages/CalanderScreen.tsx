import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

const Banner = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>산책일지</Text>
      <Image source={require('../assets/dog.png')} style={styles.bannerImage} />
    </View>
  );
};

const CalanderScreen = () => {
  // 화면에서 선택된 날짜 변수
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );

  // get API 달별산책기록 조회 변수
  const [walkMonth, setWalkMonth] = useState('');
  useEffect(() => {
    setWalkMonth(selectedDate.slice(0, 7));
  }, [selectedDate]);

  // 인터페이스: 서버에서 가져온 json형식의 데이터를 집어넣어서 다루기 쉽게 미리 설정해둔다.
  interface WalkData {
    walkList: Walk[];
  }

  interface Walk {
    // 개별 산책 데이터 인터페이스
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

  // 받아온 산책 데이터
  // const [data, setData] = useState<WalkData>({walkList: []});
  const [data, setData] = useState<WalkData | null>({walkList: []}); // 데이터를 받아오기전 null값

  // accessToken
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // AsyncStorage에서 로그인할때 받았던 토큰을 가져와서 accessToken에 저장
    AsyncStorage.getItem('accessToken')
      .then(token => {
        setAccessToken(token);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // 위에서 저장한 토큰으로 API에 GET요청해서 산책 목록 data에 저장하기
    if (accessToken) {
      console.log('\n Month changed:', walkMonth);
      axios
        .get(
          `http://awsv4-env.eba-mre2mcnv.ap-northeast-2.elasticbeanstalk.com/api/walk/${walkMonth}/list`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then(response => {
          // Handle the API response
          setData(response.data);
        })
        .catch(error => {
          // Handle the API error
          console.log(error);
        });
    }
  }, [walkMonth, accessToken]);

  useEffect(() => {
    console.log('\n data changed:', data);
  }, [data]);

  // 산책한 날짜 리스트
  const startTimeList = data.walkList.map(walk =>
    new Date(walk.startTime).toISOString().slice(0, 10),
  );

  // 1.산책한 날짜들 표시
  const walkedDates: {
    [date: string]: {selected: boolean; selectedColor: string};
  } = {};
  startTimeList.forEach(date => {
    walkedDates[date] = {selected: true, selectedColor: '#0ED678'};
  });

  // 2.클릭한 날짜들 표시
  const markedDates = {
    [selectedDate]: {selected: true, selectedColor: '#99BBFF'},
  };

  // 3.합체
  const markedSelectedDates = {
    ...walkedDates,
    ...markedDates,
  };

  const filterWalkData = (walkData: WalkData, selectedDate: string) => {
    return walkData.walkList.filter(walk => {
      // 시작 시간을 YYYY-MM-DD 형식으로 변환
      const formattedStartTime = new Date(walk.startTime)
        .toISOString()
        .slice(0, 10);
      // 선택한 날짜와 같은 경우 필터링
      return formattedStartTime === selectedDate;
    });
  };

  // 선택한 날짜에 해당하는 걷기 기록 필터링
  const filteredData = filterWalkData(data, selectedDate);

  const navigation = useNavigation();
  const renderEvent = ({item}: {item: Walk}) => {
    return (
      <TouchableOpacity
        style={styles.event}
        onPress={() =>
          navigation.navigate('CheckWalkScreen', {walkData: item})
        }>
        <Text style={styles.eventText}>
          {item.startTime.slice(11, 16)} am /{'  '}
          {Math.floor(
            (new Date(item.finishTime) - new Date(item.startTime)) /
              (1000 * 60),
          )}{' '}
          분 / {item.distance} km 산책!
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Banner />
      <Calendar
        markedDates={markedSelectedDates}
        enableSwipeMonths={true}
        onDayPress={day => setSelectedDate(day.dateString)}
        current={moment().format('YYYY-MM-DD')}
      />
      <View style={styles.listcontainer1}>
        <View style={styles.listcontainer2}>
          <FlatList
            style={styles.flatlist}
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderEvent}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  banner: {
    flexDirection: 'row',
    // backgroundColor: '#FFFFFF',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    width: '45%',
    height: '65%',
    fontFamily: 'Blinker-Bold',
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    color: '#000000',
  },
  bannerImage: {
    width: '14%',
    height: '70%',
    marginLeft: -8,
  },
  listcontainer1: {
    flex: 0.8,
    backgroundColor: '#FF8B0060',
    borderRadius: 30,
    width: '95%',
    height: 80,
    marginTop: 40,
    alignSelf: 'center',
  },
  listcontainer2: {
    flex: 0.95,
    backgroundColor: '#FFFFFFEB',
    borderRadius: 25,
    width: '93%',
    height: '90%',
    marginTop: 15,
    alignSelf: 'center',
  },

  flatlist: {
    margin: 10,
  },
  event: {
    // backgroundColor: '#F8F9FA',
    padding: 0,
    marginBottom: 12,

    width: '100%',
    height: 57,
    borderRadius: 40,
    backgroundColor: '#EEEEEE',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Blinker-SemiBold',
  },
});

export default CalanderScreen;
