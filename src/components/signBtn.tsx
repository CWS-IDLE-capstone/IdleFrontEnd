import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

function SignBtn({activeOpacity, onPress, text}: any) {
  return (
    <TouchableOpacity
      style={styles.text1}
      activeOpacity={activeOpacity}
      onPress={onPress}>
      <Text style={styles.text2}>{text}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  text1: {},
  text2: {
    backgroundColor: '#8AA2F8',
    width: WIDTH,
    flex: 1,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
export default SignBtn;
