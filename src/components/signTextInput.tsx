import React from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

type props = {
  placeholder: any;
  onChangeText: any;
  onSubmitEditing: any;
  keyboardType: any;
  textContentType: any;
  secureTextEntry: any;
  value: any;
};
function SignTextInput({
  onChangeText,
  placeholder,
  onSubmitEditing,
  keyboardType,
  textContentType,
  secureTextEntry,
  value,
}: props) {
  return (
    <TextInput
      style={styles.textInput}
      onChangeText={onChangeText}
      placeholder={placeholder}
      onSubmitEditing={onSubmitEditing}
      keyboardType={keyboardType}
      textContentType={textContentType}
      secureTextEntry={secureTextEntry}
      value={value}
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
