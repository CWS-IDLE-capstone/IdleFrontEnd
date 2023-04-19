import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';
import SplashScreen from 'react-native-splash-screen';

function App() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      SplashScreen.hide();
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <Provider store={store}>
        <AppInner />
      </Provider>
    </>
  );
}
export default App;
