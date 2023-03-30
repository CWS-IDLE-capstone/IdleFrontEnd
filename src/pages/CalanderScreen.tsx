import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native';

const Banner = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>산책일지</Text>
      <Image source={require('../assets/dog.png')} style={styles.bannerImage} />
    </View>
  );
};

const CalanderScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format('YYYY-MM-DD'),
  );

  const markedDates = {
    //클릭한 날짜
    [selectedDate]: {selected: true, selectedColor: '#99BBFF'},
  };

  const navigation = useNavigation();
  const renderEvent = ({item}: {item: string}) => {
    return (
      <TouchableOpacity
        style={styles.event}
        onPress={() => navigation.navigate('CheckWalkScreen')}>
        <Text style={styles.eventText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const data: string[] = [
    '10:30 am  /  2.15 km  /  30 분 산책!',
    '13:32 pm  /  3.20 km  /  42 분 산책!',
    '18:10 pm  /  0.85 km  /  15 분 산책!',
  ];

  return (
    <View style={styles.container}>
      <Banner />
      <Calendar
        markedDates={markedDates}
        onDayPress={day => setSelectedDate(day.dateString)}
      />
      <View style={styles.listcontainer1}>
        <View style={styles.listcontainer2}>
          <FlatList
            style={styles.flatlist}
            data={data}
            renderItem={renderEvent}
            keyExtractor={(item, index) => index.toString()}
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
    backgroundColor: '#FFFFFF',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    width: 150,
    height: 30,
    fontFamily: 'Blinker-Bold',
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 40,
    textAlign: 'center',
    color: '#000000',
  },
  bannerImage: {
    width: 43,
    height: 43,
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
