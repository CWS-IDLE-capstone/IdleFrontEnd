import React, {useCallback, useRef} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

import {RootStackParamList} from '../../App';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
type ScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

import {URLWrapper} from '../../url-wrapper';
import axios, {AxiosError} from 'axios';

const NaverLogin: React.FC<ScreenProps> = ({navigation}) => {
  const webviewRef = useRef<WebView>(null);

  const prevUrlRef = useRef<string | undefined>();

  const handleWebViewNavigationStateChange = useCallback(
    (newNavState: {url: string}, prevNavState?: {url: string}) => {
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
          axios
            .post(
              `http://awsv4-env.eba-mre2mcnv.ap-northeast-2.elasticbeanstalk.com/api/oauth/naver`,
              {
                code: code,
                state: state,
              },
            )
            .then(response => {
              const responseData = response.data; // 받은 데이터
              const token = responseData.accessToken; // JWT 토큰
              console.log(token);

              navigation.navigate('AddInfo', {accessToken: token});
              // AddInfo로 이동하면서 accessToken 전달
              // 원래는 Main으로 이동하는거다.
              // 따라서 토큰은 다른데에 저장해두고 그걸 필요할때 꺼내쓰는 방식으로 바꿔야된다.
            });
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
