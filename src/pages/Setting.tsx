/* eslint-disable react/self-closing-comp */
import React from 'react';
import {View, StyleSheet, Pressable, Text, Platform} from 'react-native';
import {useUserContext} from '../components/UserContext';
import {useAppDispatch} from '../store';
import DaonBtn from '../components/daonBtn';
import userSlice from '../slices/user';

function Setting({navigation}: ScreenProps) {
  //   const {setUser} = useUserContext();
  const dispatch = useAppDispatch();
  const onLogoutUser = () => {
    //TODO: 정보수정페이지로
    // navigation.navigate("")
    dispatch(
      //리덕스에 넣어주기
      userSlice.actions.setUser({
        name: '',
        email: '',
        accessToken: '',
      }),
    );
  };
  return (
    <>
      <View style={styles.block}>
        <Pressable
          onPress={() => {
            navigation.navigate('notification');
          }}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>알림 설정</Text>
        </Pressable>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>문의하기</Text>
        </Pressable>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>앱정보</Text>
        </Pressable>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>이용약관</Text>
        </Pressable>
      </View>
      <View style={styles.logout}>
        <DaonBtn text="로그아웃" onPress={onLogoutUser} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  item: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
  logout: {
    justifyContent: 'flex-end',
  },
});

export default Setting;
