import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

function DaonBtn({activeOpacity, onPress, text, touchableStyle, style}: any) {
  return (
    <TouchableOpacity
      style={[styles.touchable, touchableStyle]}
      activeOpacity={activeOpacity}
      onPress={onPress}>
      <Text style={[styles.text2, style]}>{text}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  touchable: {},
  text2: {
    backgroundColor: '#8AA2F8',
    width: WIDTH * 0.7,
    height: 50,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    // borderRadius: 8,
  },
});
export default DaonBtn;
