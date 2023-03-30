import {View, Text, Alert, Button} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import CalendarView from '../components/CalendarView';
import CalendarScreen from '../components/Calander';
// import {useDispatch} from 'react-redux';

function Journal() {
  // const dispatch = useDispatch();
  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    await Alert.alert(fcmToken);
    console.log(fcmToken);
    // await dispatch(actions.requestNotification(fcmToken));
  }, []);
  return (
    <View>
      <Button title="show My Token" onPress={getFcmToken} />
      {/* <CalendarView /> */}
      <CalendarScreen />
    </View>
  );
}
export default Journal;
//기기 토큰 생성
