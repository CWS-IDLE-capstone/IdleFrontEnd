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
  text1: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 5,
  },
  text2: {
    backgroundColor: '#8AA2F8',
    width: WIDTH * 0.7,

    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
  },
});
export default SignBtn;
