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
import {useSelector} from 'react-redux';

import Icon from 'react-native-vector-icons/EvilIcons';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconE from 'react-native-vector-icons/Entypo';
import NaverLogin from './src/pages/NaverLogin';
import AddInfo from './src/pages/AddInfo';
import CalanderScreen from './src/pages/CalanderScreen';
import CheckWalkScreen from './src/pages/CheckWalkScreen';
import Walk from './src/pages/Walk';
import {RootState} from './src/store/reducer';

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
  AddInfo: undefined;
  CalanderScreen: undefined;
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
  NaverLogin: undefined;

  Main: undefined;
  Calander: undefined;
  CheckWalkScreen: undefined;
};

const Tab = createBottomTabNavigator<LoggedInParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function LoggedInStack() {
  // 캘린더에서 상세정보페이지로 데이터 전달이 안되어 함수로 묶었습니다
  // 스택 네비게이터 고수님의 보호관찰이 필요합니다.
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={Main} />
      {/* <Stack.Screen name="CalanderScreen" component={CalanderScreen} /> */}
      <Stack.Screen
        name="CheckWalkScreen"
        component={CheckWalkScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function AppInner() {
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );
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
    <NavigationContainer>
      {isLoggedIn ? (
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
            component={LoggedInStack} // 묶은거
            options={{
              title: '산책가자',
              headerShown: false, // 상단 네비게이션바 한번 지워봤습니다.
              tabBarIcon: ({color}) => (
                <IconE name="baidu" size={35} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="CalanderScreen"
            component={CalanderScreen}
            options={{
              title: '산책일지',
              headerShown: false,
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
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="EmailSignUp" component={EmailSignUp} />
          <Stack.Screen name="FinishSignUp" component={FinishSignUp} />
          <Stack.Screen name="MoreInfo" component={MoreInfo} />
          <Stack.Screen name="AddInfo" component={AddInfo} />
          <Stack.Screen name="Walk" component={Walk} />
          <Stack.Screen name="NaverLogin" component={NaverLogin} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
export default AppInner;
