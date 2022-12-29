/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// import {NavigationContainer} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import EmailSignUp from './src/pages/EmailSignUp';
import SignUp from './src/pages/SignUp';
import Start from './src/pages/Start';

export type RootStackParamList = {
  Start: undefined;
  SignUp: undefined;
  EmailSignUp: undefined;
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
        </Stack.Navigator>
        {/* <EmailSignUp /> */}
        {/*  */}
      </NavigationContainer>
    </>
  );
}

export default App;
