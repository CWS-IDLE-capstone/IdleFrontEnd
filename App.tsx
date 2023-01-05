import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {} from 'react-native';
import EmailSignUp from './src/pages/EmailSignUp';
import FinishSignUp from './src/pages/FinishSignUp';
import SignUp from './src/pages/SignUp';
import Start from './src/pages/Start';

export type RootStackParamList = {
  Start: undefined;
  SignUp: undefined;
  EmailSignUp: undefined;
  FinishSignUp: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="EmailSignUp" component={EmailSignUp} />
          <Stack.Screen name="FinishSignUp" component={FinishSignUp} />
        </Stack.Navigator>
        {/* <EmailSignUp /> */}
        {/*  */}
      </NavigationContainer>
    </>
  );
}

export default App;
