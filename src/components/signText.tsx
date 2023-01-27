import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

function SignText({text}: any) {
  return <Text style={styles.text1}>{text}</Text>;
}
const styles = StyleSheet.create({
  text1: {
    width: WIDTH * 0.2,
    textAlignVertical: 'center',
    textAlign: 'right',
  },
});

export default SignText;
