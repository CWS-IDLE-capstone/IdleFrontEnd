import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet} from 'react-native';
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

import {UserContextProvider} from './src/components/UserContext';
import Setting from './src/pages/Setting';
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
  const [isTabVisible, setIsTabVisible] = useState(true);
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: styles.headerStyle,
        headerTintColor: '#8AA2F8',
        headerTitleStyle: {fontSize: 23, fontWeight: 'bold'},
        headerShown: false,
        tabBarStyle: {
          ...styles.tabStyle,
          // display: isTabVisible ? 'flex' : 'none', //산책시 하단탭 사라질지
        },
      }}>
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          title: '게시판',
          tabBarActiveTintColor: '#8AA2F8',

          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./src/assets/selectChat.png')
                  : require('./src/assets/chat.png')
              }
              style={{width: 35, height: 35}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Main"
        children={() => <Main setIsTabVisible={setIsTabVisible} />}
        options={{
          title: '산책',
          tabBarActiveTintColor: '#8AA2F8',
          tabBarLabelStyle: {marginRight: 8},
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./src/assets/free-icon-dog-walking-3330957.png')
                  : require('./src/assets/free-icon-dog-walking-3330956.png')
              }
              style={{width: 35, height: 35}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CalanderScreen"
        component={CalanderScreen}
        options={{
          title: '산책달력',
          tabBarActiveTintColor: '#8AA2F8',
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./src/assets/selectCalendar.png')
                  : require('./src/assets/calendar.png')
              }
              style={{width: 35, height: 35}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          title: '마이페이지',
          tabBarActiveTintColor: '#8AA2F8',
          tabBarIcon: ({focused}) => (
            <Image
              source={
                focused
                  ? require('./src/assets/selectUser.png')
                  : require('./src/assets/user.png')
              }
              style={{width: 35, height: 35}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function AppInner() {
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  ); //리덕스에서 가져오기
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
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
          }}>
          <Stack.Screen
            name="Inner"
            component={LoggedInStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CheckWalkScreen"
            component={CheckWalkScreen}
            options={{
              headerLeft: () => null,
              headerTitle: '',
              gestureEnabled: false,
              // headerShown: false, //뒤로가기버튼
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen
            name="EmailSignUp"
            component={EmailSignUp}
            options={{
              headerTitle: '회원가입',
              headerTitleStyle: {fontSize: 24},
            }}
          />
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

const styles = StyleSheet.create({
  headerStyle1: {
    borderWidth: 0,
    elevation: 0,
  },
  headerStyle: {
    // borderBottomWidth: 2,
    borderWidth: 3,

    // borderBottomColor: '#AAAAAA',
  },
  tabStyle: {
    height: '8.5%',
    paddingTop: '2%',
    paddingBottom: '2%',
    borderTopWidth: 1,
    borderColor: '#AAAAAA',
  },
});
