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
import ApppA from './src/pages/ApppA';

export type LoggedInParamList = {
  Community: undefined;
  MyPage: undefined;
  Main: undefined;
  ApppA: undefined;
};
export type RootStackParamList = {
  Welcome: undefined;
  Start: undefined;
  SignUp: undefined;
  Login: undefined;
  EmailSignUp: undefined;
  FinishSignUp: undefined;
  Main: undefined;
  MoreInfo: undefined;
};
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
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
    <>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tab.Navigator initialRouteName="Main">
            <Tab.Screen
              name="Community"
              component={Community}
              options={{title: '커뮤니티'}}
            />
            <Tab.Screen
              name="Main"
              component={Main}
              options={{title: '산책가자'}}
            />
            <Tab.Screen
              name="MyPage"
              component={MyPage}
              options={{title: '마이페이지'}}
            />
            <Tab.Screen
              name="ApppA"
              component={ApppA}
              options={{title: 'aaaa'}}
            />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen
              name="Login"
              // component={Login}
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
    </>
  );
}

export default App;
