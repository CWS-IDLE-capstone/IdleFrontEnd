import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

const Banner = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>산책일지</Text>
      {/* <Image source={require('../assets/dog.png')} style={styles.bannerImage} /> */}
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

  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem('accessToken');
          // const token = accessToken;
          if (token !== null) {
            const response = await axios.get(
              'http://awsv4-env.eba-mre2mcnv.ap-northeast-2.elasticbeanstalk.com/api/walk/list',
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            setData(response.data);
          } else {
            console.log('Token not found');
          }
        } catch (error) {
          console.log('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []),
  );
  // 산책한 날짜 리스트
  const startTimeList = data.walkList.map(walk =>
    new Date(walk.startTime).toISOString().slice(0, 10),
  );

  // 1.산책한 날짜들 표시
  const walkedDates: {
    [date: string]: {marked: boolean; dotColor: string};
  } = {};
  startTimeList.forEach(date => {
    walkedDates[date] = {
      marked: true,
      dotColor: '#8AA2F8',
      // selected: true,
      // selectedColor: '#0ED678',
    };
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

  // 산책 데이터가 없는 경우
  const NoWalkData = () => {
    return (
      <View style={styles.noDataContainer}>
        <Image source={require('../assets/흰둥이.png')} style={styles.흰둥이} />
        <Text style={styles.noDataText}>
          이 날은 산책한 기록이 없어요.{'\n'}지금 반려견과 산책을 시작해보세요!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Banner />
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩중...</Text>
        </View>
      ) : (
        <>
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
                ListEmptyComponent={NoWalkData}
              />
            </View>
          </View>
        </>
      )}
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
    color: '#8AA2F8',
  },
  bannerImage: {
    width: '14%',
    height: '70%',
    marginLeft: -8,
  },
  listcontainer1: {
    flex: 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: '95%',
    height: 80,
    marginTop: 40,
    alignSelf: 'center',
  },
  listcontainer2: {
    flex: 0.95,
    backgroundColor: '#8AA2F840',
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
    backgroundColor: '#6A74CF80',
    // elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Blinker-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,
  },
  흰둥이: {
    width: 150,
    height: 90,
  },
});

export default CalanderScreen;
