import {View, Text, Alert, Button} from 'react-native';
import React, {useCallback} from 'react';
import messaging from '@react-native-firebase/messaging';
// import {useDispatch} from 'react-redux';
function ApppA() {
  // const dispatch = useDispatch();
  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    await Alert.alert(fcmToken);
    console.log(fcmToken);
    // await dispatch(actions.requestNotification(fcmToken));
  }, []);
  return (
    <View>
      <Text>ApppA</Text>
      <Button title="get Token!!" onPress={getFcmToken} />
    </View>
  );
}
export default ApppA;
//기기 토큰 생성
