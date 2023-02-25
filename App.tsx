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
import { Provider, useSelector } from 'react-redux';
import store from './src/store';
import { RootState } from './src/store/reducer';
import AppInner from './AppInner';


function App() {
  // TODO: isLoggedIn = useSelector 이용하여 상태관리
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Provider store={store}>
         <AppInner />
      </Provider>
    </>
  );
}

export default App;
