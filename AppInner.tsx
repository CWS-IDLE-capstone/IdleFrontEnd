import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import EmailSignUp from './src/pages/EmailSignUp';
import FinishSignUp from './src/pages/FinishSignUp';
import SignUp from './src/pages/SignUp';
import Start from './src/pages/Start';
import Welcome from './src/pages/Welcome';
import Login from './src/pages/Login';
import Main from './src/pages/Main';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Community from './src/pages/Community';
import MyPage from './src/pages/MyPage';
import messaging from '@react-native-firebase/messaging';
import MoreInfo from './src/pages/MoreInfo';
import Journal from './src/pages/Journal';

import {UserContextProvider} from './src/components/UserContext';
import Setting from './src/pages/Setting';
import Icon from 'react-native-vector-icons/EvilIcons';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconE from 'react-native-vector-icons/Entypo';
// export type LoggedInParamList = {
//   Community: undefined;
//   MyPage: undefined;
//   Main: undefined;
//   Journal: undefined;
//   Setting: undefined;
// };
// export type RootStackParamList = {
//   Welcome: undefined;
//   Start: undefined;
//   SignUp: undefined;
//   Login: undefined;
//   EmailSignUp: undefined;
//   FinishSignUp: undefined;
//   Main: undefined;
//   MoreInfo: undefined;
//   Setting: undefined;
// };

export type LoggedInParamList = {
  Community: undefined;
  MyPage: undefined;
  Main: undefined;
  Journal: undefined;
  Setting: undefined;
  Welcome: undefined;
  Start: undefined;
  SignUp: undefined;
  Login: undefined;
  EmailSignUp: undefined;
  FinishSignUp: undefined;
  MoreInfo: undefined;
};
export type RootStackParamList = {
  Welcome: undefined;
  Start: undefined;
  SignUp: undefined;
  Login: undefined;
  EmailSignUp: undefined;
  FinishSignUp: undefined;
  MoreInfo: undefined;
  Setting: undefined;
  MyPage1: undefined;
};
const Tab = createBottomTabNavigator<LoggedInParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
function MyPageTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        tabBarActiveTintColor: '#ff8c00',
      }}>
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          title: '메시지',
          tabBarIcon: ({color}) => (
            <IconE name="chat" size={35} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          title: '산책가자',
          tabBarIcon: ({color}) => (
            <IconE name="baidu" size={35} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={Journal}
        options={{
          title: '산책일지',
          tabBarIcon: ({color}) => (
            <Icon name="calendar" size={45} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          title: '마이페이지',
          tabBarIcon: ({color}) => (
            <IconAD name="user" size={40} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function AppInner() {
  // TODO: isLoggedIn = useSelector 이용하여 상태관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log(
        'A new foreground FCM message arrived!!',
        JSON.stringify(remoteMessage),
      );
    });

    return unsubscribe;
  }, []);

  return (
    <UserContextProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <Stack.Navigator>
            <Stack.Screen
              name="MyPage1"
              component={MyPageTabs}
              options={{
                title: '마이페이지1',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Setting"
              children={() => <Setting setIsLoggedIn={setIsLoggedIn} />}
              options={{
                title: '설정',
              }}
            />
            {/* 정보수정페이지만든후연결위치 */}
            {/* <Stack.Screen name="AddInfo" /> */}
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen
              name="Login"
              children={() => <Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="EmailSignUp" component={EmailSignUp} />
            <Stack.Screen name="FinishSignUp" component={FinishSignUp} />
            <Stack.Screen name="MoreInfo" component={MoreInfo} />
            {/* <Stack.Screen name="Main" component={Main} /> */}
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </UserContextProvider>
  );
}
export default AppInner;
