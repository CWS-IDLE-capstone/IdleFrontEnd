import React, {useCallback, useRef} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

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
import Config from 'react-native-config';

function NaverLogin({navigation} : ScreenProps) {
  const webviewRef = useRef<WebView>(null);
  const dispatch = useAppDispatch();
  const prevUrlRef = useRef<string | undefined>();

  const handleWebViewNavigationStateChange = useCallback(
    async (newNavState: {url: string}, prevNavState?: {url: string}) => {
      const {url} = newNavState;

      if (!url) return;

      // 현재 URL과 이전 URL이 같을 경우 함수 실행하지 않음
      if (prevUrlRef.current === url) return;

      // 현재 URL을 이전 URL로 업데이트
      prevUrlRef.current = url;

      // 웹 URL에서 code값과 state값을 원시적인 방법으로 추출
      if (url.includes('login/oauth2/code/naver?code=')) {
        const urlWrapper = new URLWrapper(url);
        const pureURL = JSON.stringify(urlWrapper._url);
        const result = pureURL.slice(47, 81);
        const code = result.slice(5, 23);
        const state = result.slice(30, 35);
        console.log('code: ', code);
        console.log('state: ', state);

        try {
          const response = await axios.post(`${Config.API_URL}/api/oauth/naver`, {
            code: code,
            state: state,
          });
          console.log(response.data);
          // Alert.alert('알림', '로그인 되었습니다.');
          // console.log('로그인 되었습니다.');
          dispatch(
            //리덕스에 넣어주기
            userSlice.actions.setUser({
              //TODO 서버에서 무엇을 데이터로 줄지 알아봐야됨 현재는 name, email, accessToken, refreshToken
              // name: response.data.name,
              // email: response.data.email,
              accessToken: response.data.accessToken, // 유효기간 10분, 5분, 1시간
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
      }
    },
    [navigation],
  );

  const NAVER_LINK =
    'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=ZJgU_ewa3JbBsSyXwPJG&redirect_uri=http://localhost:8081/login/oauth2/code/naver&state=test';

  return (
    <WebView
      ref={webviewRef}
      source={{uri: NAVER_LINK}}
      style={styles.container}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      // onMessage={handleWebViewMessage}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'stretch', // 중요 이거 안써주면 WebView 에 width 값을 지정해야함
    justifyContent: 'center',
  },
});

export default NaverLogin;
