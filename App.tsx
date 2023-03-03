import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {} from 'react-native';
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
import NaverLogin from './src/pages/NaverLogin';
import AddInfo from './src/pages/AddInfo';

export type LoggedInParamList = {
  Community: undefined;
  MyPage: undefined;
  Main: undefined;
  ApppA: undefined;
  AddInfo: undefined;
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
  NaverLogin: undefined;
};
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();
function App() {
  // TODO: isLoggedIn = useSelector 이용하여 상태관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
            <Tab.Screen
              name="AddInfo"
              component={AddInfo}
              options={{title: '회원정보수정'}}
            />
          </Tab.Navigator>
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
            <Stack.Screen name="NaverLogin" component={NaverLogin} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="AddInfo" component={AddInfo} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
}

export default App;
