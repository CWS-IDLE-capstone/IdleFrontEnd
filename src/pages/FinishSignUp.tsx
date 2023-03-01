import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';

const {width: WIDTH} = Dimensions.get('window');
type ScreenProps = NativeStackScreenProps<RootStackParamList, 'MoreInfo'>;
function FinishSignUp({navigation}: ScreenProps) {
  const toMoreInfo = useCallback(() => {
    navigation.navigate('MoreInfo');
  }, [navigation]);

  return (
    <>
      <View style={styles.container1}>
        <Text style={styles.finText}>회원가입 완료!</Text>
      </View>
      <View style={styles.container2}>
        <TouchableOpacity activeOpacity={0.9} onPress={toMoreInfo}>
          <Text style={styles.nextBtn}>다음 단계로</Text>
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
