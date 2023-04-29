import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

function DaonBtn({activeOpacity, onPress, text, style}: any) {
  return (
    <TouchableOpacity
      style={styles.text1}
      activeOpacity={activeOpacity}
      onPress={onPress}>
      <Text style={[styles.text2, style]}>{text}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  text1: {},
  text2: {
    backgroundColor: '#8AA2F8',
    // width: WIDTH * 0.4,
    // height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    // borderRadius: 8,
  },
});
export default DaonBtn;
