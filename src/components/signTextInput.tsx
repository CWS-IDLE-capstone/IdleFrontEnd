import React from 'react';
import {Dimensions, StyleSheet, TextInput} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

type props = {
  placeholder: string;
  onChangeText: any;
  onSubmitEditing: any;
  keyboardType: any;
  textContentType: any;
  secureTextEntry: any;
  value: any;
  style: any;
};
function SignTextInput({
  onChangeText,
  placeholder,
  onSubmitEditing,
  keyboardType,
  textContentType,
  secureTextEntry,
  value,
  style,
}: props) {
  return (
    <TextInput
      style={[styles.textInput, style]}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={'#949494'}
      onSubmitEditing={() => onSubmitEditing}
      keyboardType={keyboardType}
      textContentType={textContentType}
      secureTextEntry={secureTextEntry}
      value={value}
    />
  );
}
const styles = StyleSheet.create({
  textInput: {
    // backgroundColor: 'white',
    // marginLeft: 15,
    // width: WIDTH * 0.67,
    paddingLeft: 15,
    color: 'black',
    borderColor: '#C4C4C4',
    borderWidth: 2,
    borderRadius: 15,
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
