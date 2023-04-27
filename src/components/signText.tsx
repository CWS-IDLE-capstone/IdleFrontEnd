import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

function SignText({text}: any) {
  return <Text style={styles.text1}>{text}</Text>;
}
const styles = StyleSheet.create({
  text1: {
    color: '#000',
    fontWeight: '700',
    marginLeft: 15,
    marginBottom: 5,
    // width: WIDTH * 0.3,
    textAlignVertical: 'center',
    // textAlign: 'right',
    paddingRight: 10,
  },
});

export default SignText;
