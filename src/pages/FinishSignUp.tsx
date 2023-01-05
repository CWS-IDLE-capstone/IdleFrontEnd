import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {width: WIDTH} = Dimensions.get('window');

function FinishSignUp(_params: any) {
  return (
    <>
      <View style={styles.container1}>
        <Text style={styles.finText}>회원가입 완료!</Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity activeOpacity={0.9}>
          <Text style={styles.nextBtn}>이메일로 시작하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
export default FinishSignUp;
const styles = StyleSheet.create({
  container1: {
    flex: 3,
  },
  container2: {
    flex: 1,
  },
  finText: {
    textAlign: 'center',
    marginTop: 150,
    fontSize: 40,
    fontWeight: 'bold',
  },

  nextBtn: {
    backgroundColor: 'darkslateblue',
    width: WIDTH * 0.8,
    height: 40,
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'white',
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 5,
  },
});
