/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().registerDeviceForRemoteMessages();

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notification caused app to open from background state:',
    remoteMessage.notification,
  );
});
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
    }
  });
// FCM 주제에 대한 구독자 추가
messaging()
  .subscribeToTopic('yjGoo1')
  .then(() => {
    console.log('test 토픽 구독 완료');
  })
  .catch(error => {
    console.log('test 토픽 구독 실패:', error);
  });
AppRegistry.registerComponent(appName, () => App);

console.disableYellowBox = true;
