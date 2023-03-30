/* eslint-disable react/self-closing-comp */
import React from 'react';
import {View, StyleSheet, Pressable, Text, Platform} from 'react-native';
import {useUserContext} from '../components/UserContext';

function Setting({setIsLoggedIn}: any) {
  //   const {setUser} = useUserContext();

  const onLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <View style={styles.block}>
      <Pressable
        onPress={onLogout}
        style={pressed => [
          styles.item,
          pressed && Platform.select({ios: {opacity: 0.5}}),
        ]}
        android_ripple={{
          color: '#eee',
        }}>
        <Text style={styles.itemText}>로그아웃</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingTop: 32,
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
  },
});

export default Setting;
