import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {useNavigation} from '@react-navigation/native';

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [walks, setWalks] = useState([]);

  // 이번 달 산책 정보 계산하기
  const thisMonthWalks = walks.filter(walk => {
    const walkDate = new Date(walk.date);
    const thisMonth = new Date().getMonth();
    return walkDate.getMonth() === thisMonth;
  });

  const totalWalks = thisMonthWalks.length;
  const totalDistance = thisMonthWalks.reduce(
    (acc, cur) => acc + cur.distance,
    0,
  );
  const totalTime = thisMonthWalks.reduce((acc, cur) => acc + cur.time, 0);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    navigation.navigate('Walk', {date: day.dateString});
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>산책횟수: {totalWalks}</Text>
        <Text style={styles.bannerText}>산책거리: {totalDistance}</Text>
        <Text style={styles.bannerText}>총 산책 시간: {totalTime}</Text>
      </View>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={{
          '2023-03-01': {
            marked: true,
            dotColor: '#2E66E7',
          },
          '2023-03-02': {
            marked: true,
            dotColor: '#2E66E7',
          },
          '2023-03-04': {
            marked: true,
            dotColor: '#2E66E7',
          },
          '2023-03-05': {
            marked: true,
            dotColor: '#2E66E7',
          },
          '2023-03-30': {
            marked: true,
            dotColor: '#2E66E7',
          },
          [selectedDate]: {
            selected: true,
            selectedColor: '#2E66E7',
          },
        }}
        monthFormat={'yyyy년 MM월'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    backgroundColor: '#2E66E7',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

export default CalendarScreen;
