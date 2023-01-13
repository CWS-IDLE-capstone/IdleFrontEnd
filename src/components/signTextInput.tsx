import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');
function SignTextInput({
  onChangeText,
  placeholder,
  onSubmitEditing,
  keyboardType,
  textContentType,
  secureTextEntry,
}) {
  return (
    <TextInput
      style={styles.textInput}
      onChangeText={onChangeText}
      placeholder={placeholder}
      onSubmitEditing={onSubmitEditing}
      keyboardType={keyboardType}
      textContentType={textContentType}
      secureTextEntry={secureTextEntry}
    />
  );
}
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    marginLeft: 15,
    width: WIDTH * 0.67,
    borderWidth: 1,
    borderRadius: 3,
  },
});
// SignTextInput.propTypes = {
//   onChangeText: PropTypes.string,
//   onSubmitEditing: PropTypes.string,
//   keyboardType: PropTypes.string,
//   textContentType: PropTypes.string,
//   secureTextEntry: PropTypes.string,
// };
export default SignTextInput;
