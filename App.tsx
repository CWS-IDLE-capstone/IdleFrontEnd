import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import EmailSignUp from './src/pages/EmailSignUp';
import FinishSignUp from './src/pages/FinishSignUp';
import SignUp from './src/pages/SignUp';
import Start from './src/pages/Start';
import Welcome from './src/pages/Welcome';
import Login from './src/pages/Login';
import Main from './src/pages/Main';
import MoreInfo from './src/pages/MoreInfo';

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
const Stack = createNativeStackNavigator<RootStackParamList>();
function App() {
  return (
    <>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Welcome" component={MoreInfo} />
            <Stack.Screen name="Start" component={Start} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="EmailSignUp" component={EmailSignUp} />
            <Stack.Screen name="FinishSignUp" component={FinishSignUp} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="MoreInfo" component={MoreInfo} />
          </Stack.Navigator>
          {/* <EmailSignUp /> */}
          {/*  */}
        </NavigationContainer>
    </>
  );
}

export default App;
