import React, {useCallback, useRef, useState, useEffect} from 'react';
import {StyleSheet, Alert, View, Text} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
type ScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NaverLogin',
  'SignUp'
>;
import {URLWrapper} from '../../url-wrapper';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

function NaverLogin({navigation}: ScreenProps) {
  const webviewRef = useRef<WebView>(null);
  const dispatch = useAppDispatch();
  const prevUrlRef = useRef<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!url) return;

    // URL에서 code값과 state값을 추출
    if (url.includes('login/oauth2/code/naver?code=')) {
      const urlWrapper = new URLWrapper(url);
      const pureURL = JSON.stringify(urlWrapper._url);
      const result = pureURL.slice(47, 81);
      const code = result.slice(5, 23);
      const state = result.slice(30, 35);
      console.log('code: ', code);
      console.log('state: ', state);

      (async () => {
        try {
          const response = await axios.post(
            'http://awsv4-env.eba-mre2mcnv.ap-northeast-2.elasticbeanstalk.com/api/oauth/naver',
            {
              code: code,
              state: state,
            },
          );
          console.log(response.data.accessToken);
          AsyncStorage.setItem('accessToken', response.data.accessToken);
          dispatch(
            userSlice.actions.setUser({
              accessToken: response.data.accessToken,
            }),
          );
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.error(errorResponse);
          if (errorResponse) {
            Alert.alert('알림', errorResponse.data.message);
          }
        }
      })();
    }
  }, [url, dispatch]);

  // 웹뷰의 onNavigationStateChange 이벤트에서 <URL>만 추출합니다
  const handleWebViewNavigationStateChange = useCallback(
    async (newNavState: {url: string}, prevNavState?: {url: string}) => {
      const {url} = newNavState;
      if (!url) return;
      if (prevUrlRef.current === url) return;
      prevUrlRef.current = url;
      setUrl(url);
    },
    [],
  );

  const NAVER_LINK =
    'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=ZJgU_ewa3JbBsSyXwPJG&redirect_uri=http://localhost:8081/login/oauth2/code/naver&state=test';

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{uri: NAVER_LINK}}
        style={styles.webview}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
      {/* {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로그인중...</Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webview: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'stretch', // 중요 이거 안써주면 WebView 에 width 값을 지정해야함
    justifyContent: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default NaverLogin;
