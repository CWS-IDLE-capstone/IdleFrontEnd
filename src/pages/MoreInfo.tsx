import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import SignTextInput from '../components/signTextInput';
import {
  Pressable,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';

type ScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

function MoreInfo({navigation}: ScreenProps) {
  const [response, setResponse] = useState(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [modal, setModal] = useState(false);
  const [img, setImg] = useState(false);
  const [dogName, setDogName] = useState('');
  const [dogSex, setDogSex] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogAge, setDogAge] = useState('');
  // const [dogGender, setDogGender] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState();

  // 카메라 촬영
  const onLaunchCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      res => {
        if (res.didCancel) {
          //취소했을 경우
          return;
        }
        setResponse(res); //이미지 보낼때 이거 쓰면 될거같음
        setImg(true);
        setModal(prev => !prev);
        console.log(res.assets[0].uri);
      },
    );
  };
  // 갤러리에서 사진 선택
  const onLaunchImageLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      res => {
        if (res.didCancel) {
          //취소했을 경우
          return;
        }
        setResponse(res);
        // setResponse(res.assets[0].uri);
        setImg(true);
        setModal(prev => !prev);
        console.log(res.assets[0].uri);
      },
    );
  };
  //fetch 보내기
  const fetchMoreInfo = () => {
    if (dogName === '') {
      return Alert.alert('강아지의 이름을 확인해주세요');
    }
    // if (dogSex === '') {
    //   return Alert.alert('강아지의 성별을 클릭해주세요');
    // }
    if (dogBreed === '') {
      return Alert.alert('강아지의 이름을 확인해주세요');
    }
    if (dogAge === '') {
      return Alert.alert('강아지의 이름을 확인해주세요');
    } else {
      fetch(`${Config.API_URL}/api/dog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          dogName: dogName,
          age: dogAge,
          breed: dogBreed,
          // dogSex,
          // imageUrl //프로필이미지
        }),
      })
        .then(() => {
          console.log('success');
          navigation.navigate('Login');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  // const axiosMoreInfo = async () => {
  //   await axios.post('http://localhost:4000/api/dog', {
  //     dogName,
  //     dogAge,
  //     dogBreed,
  //     dogSex,
  //   });
  // };

  // const LoginTapped = useCallback(async () => {
  //   if (loading) {
  //     return;
  //   }
  //   // 입력된 텍스트 검토하는 로직..
  //   try {
  //     setLoading(true);
  //     const response = await axios.post('http://localhost:4000/api/dog', {
  //       dogName,
  //       dogAge,
  //       dogBreed,
  //       dogSex
  //     });
  //     //가져온 데이터 store에 넣어주는 코드..
  //     //가져온 토큰은 보안을 위해 Encrypted-Storage에 넣어주는 코드..
  //   } catch (error) {
  //     const errorResponse = (error as AxiosError<{message: string}>).response;
  //     if (errorResponse) {
  //       Alert.alert(errorResponse.data.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [dogName,dogAge, dogBreed, dogSex, loading])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.header} behavior="position">
        <ImageBackground
          // source={require('../assets/bg1.jpg')}
          style={styles.bgImage}>
          <View style={{marginBottom: 15}}>
            <Text style={styles.title}>프로필</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setModal(prev => !prev)}>
            <View
              style={{
                width: 200,
                height: 200,
                backgroundColor: 'white',
                borderWidth: 1.5,
                borderRadius: 100,
                borderColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              <Image
                source={
                  img
                    ? {uri: response?.assets[0]?.uri}
                    : require('../assets/puppy.jpg')
                } //'../assets/puppy.jpg'
                style={styles.image}
              />
            </View>
          </TouchableOpacity>

          <View style={{marginBottom: 70}}>
            <View style={styles.row}>
              <View style={styles.row}>
                <Text style={styles.login2}>이름</Text>
                <TextInput
                  style={styles.Input}
                  value={dogName}
                  onChangeText={setDogName}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.login2}>성별</Text>
                {/* <TextInput style={styles.Input} value={dogSex} onChangeText={setDogSex} /> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: 'white',
                    width: 75,
                    height: 40,
                    borderRadius: 15,
                    marginTop: 5,
                    marginBottom: 5,
                    justifyContent: 'center',
                    borderColor: '#6A74CF',
                    borderWidth: 1,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      padding: 2,
                      borderRightColor: 'gray',
                      borderRightWidth: 1,
                    }}
                    onPress={() => setDogSex('male')}>
                    <Icon
                      name="male"
                      style={{
                        fontSize: 25,
                        color: dogSex === 'male' ? '#6A74CF' : 'grey',
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{backgroundColor: 'white', padding: 2}}
                    onPress={() => setDogSex('female')}>
                    <Icon
                      name="female"
                      style={{
                        fontSize: 25,
                        color: dogSex === 'female' ? '#6A74CF' : 'grey',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                <Text style={styles.login2}>견종</Text>
                {/* <TextInput style={styles.Input} value={dogBreed} onChangeText={setDogBreed} /> */}
                <View style={styles.Input}></View>
                <Picker
                  selectedValue={dogBreed}
                  onValueChange={(itemValue, itemIndex) =>
                    setDogBreed(itemValue)
                  }
                  style={{
                    width: 160,
                    height: 10,
                    alignSelf: 'center',
                    // backgroundColor: 'yellow',
                    position: 'absolute',
                    zIndex: 1,
                    top: 0,
                    left: 45,
                    color: 'black',
                  }}>
                  <Picker.Item
                    label="Select"
                    value="선택하기"
                    style={{color: 'grey'}}
                  />
                  <Picker.Item label="몰티즈" value="몰티즈" />
                  <Picker.Item label="푸들" value="푸들" />
                  <Picker.Item label="포메라니안" value="포메라니안" />
                  <Picker.Item label="믹스견" value="믹스견" />
                  <Picker.Item label="치와와" value="치와와" />
                  <Picker.Item label="시추" value="시추" />
                  <Picker.Item label="골든리트리버" value="골든리트리버" />
                  <Picker.Item label="진돗개" value="진돗개" />
                </Picker>
              </View>
              <View style={styles.row}>
                <Text style={styles.login2}>나이</Text>
                <TextInput
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    backgroundColor: 'white',
                    width: 75,
                    height: 40,
                    borderRadius: 15,
                    marginTop: 5,
                    marginBottom: 5,
                    justifyContent: 'center',
                    borderColor: '#6A74CF',
                    borderWidth: 1,
                  }}
                  keyboardType="number-pad"
                  value={dogAge}
                  onChangeText={setDogAge}
                />
              </View>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={styles.btn1Align}
              activeOpacity={0.5}
              onPress={fetchMoreInfo}>
              <Text style={styles.btnStyle}>확인</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {modal ? (
          <View
            style={{
              position: 'absolute',
              zIndex: 1,
              backgroundColor: 'white',
              width: '60%',
              height: 80,
              alignItems: 'center',
              alignSelf: 'center',
              top: windowHeight / 3,
              // left: windowWidth / 4,
              borderRadius: 5,
            }}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={onLaunchCamera}>
              <View
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 5,
                  borderBottomColor: 'grey',
                  borderBottomWidth: 0.5,
                }}>
                <Material
                  name="photo-camera"
                  style={{
                    fontSize: 25,
                    padding: 4,
                  }}
                />
                <Text style={{fontWeight: 'bold', padding: 4}}>
                  카메라로 촬영하기
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={onLaunchImageLibrary}>
              <View
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: 5,
                  borderBottomColor: 'grey',
                  borderBottomWidth: 0.5,
                }}>
                <Material
                  name="photo"
                  style={{
                    fontSize: 25,
                    padding: 4,
                  }}
                />
                <Text style={{fontWeight: 'bold', padding: 4, color: 'black'}}>
                  갤러리에서 선택
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const {width: WIDTH} = Dimensions.get('window');

const styles = StyleSheet.create({
  row: {flexDirection: 'row', marginTop: 5, justifyContent: 'space-evenly'},
  header: {flex: 1, backgroundColor: '#d6E3F3'},
  bgImage: {width: '100%', height: '100%'},

  btn1Align: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  btnStyle: {
    backgroundColor: '#8AA2F8',
    width: WIDTH * 0.7,
    fontFamily: 'Binggrae-Bold',
    height: 50,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    color: 'black',
    alignSelf: 'center',
    fontFamily: 'Binggrae-Bold',
  },
  login2: {
    fontSize: 18,
    color: '#6A74CF',
    alignSelf: 'center',
    marginRight: 10,
    fontFamily: 'Binggrae-Bold',
  },
  image: {
    width: '98%',
    height: '98%',
    borderRadius: 100,
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  Input: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    width: WIDTH * 0.3,
    height: 40,
    color: 'black',
    textAlign: 'left',
    textAlignVertical: 'center',
    borderRadius: 15,
    borderColor: '#6A74CF',
    borderWidth: 1,
  },
});

export default MoreInfo;
