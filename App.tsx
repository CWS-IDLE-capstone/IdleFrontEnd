import React from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
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
