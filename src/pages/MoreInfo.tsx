import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RootStackParamList } from '../../App';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera } from "react-native-image-picker";



function MoreInfo() {

  const [response, setResponse] = useState(null);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [modal, setModal] = useState(false);
  const [img, setImg] = useState(false);
  const [dogName, setDogName] = useState('');
  const [dogSex, setDogSex] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogAge, setDogAge] = useState('');

  
  // 카메라 촬영
  const onLaunchCamera = () => {
    launchCamera({
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      includeBase64: Platform.OS === 'android',
    }, 
    (res) => {
      if (res.didCancel) {;
        //취소했을 경우
        return;
      }
      setResponse(res); //이미지 보낼때 이거 쓰면 될거같음
      setImg(true);
      setModal(prev => !prev);
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
      (res) => {
        if (res.didCancel) {;
          //취소했을 경우
          return;
        }
        setResponse(res);
        setImg(true);
        setModal(prev => !prev);
      },
    )
  };
  //fetch 보내기
  const fetchMoreInfo = () => {
    fetch('http://localhost:4000/api/dog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        dogName,
        dogAge,
        dogBreed,
        dogSex,
      }),
    }).then(()=>{
      console.log("success");
    }).catch((error)=>{
        console.log(error);
    });
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
      <KeyboardAvoidingView style={styles.header}>
        <ImageBackground source={require("../assets/bg1.jpg")} style={styles.bgImage}>

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.title}>Profile</Text>
          </View>

        <TouchableOpacity activeOpacity={0.5} onPress={() => setModal(prev => !prev)}>
          <View style={{
             width: 200,
             height: 200,
             backgroundColor: 'white',
             borderWidth: 1.5,
             borderRadius: 100,
             borderColor: 'white', 
             justifyContent: 'center',
             alignItems: 'center',
             alignSelf: 'center',
             marginBottom: 20
          }}>
            <Image 
                  source={img ? {uri: response?.assets[0]?.uri} : require('../assets/puppy.jpg')}//'../assets/puppy.jpg'
                  style={styles.image}
              />
            </View>
          </TouchableOpacity>

          <View style={{ marginBottom : 70 }}>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={styles.login2}>name</Text>
                        <TextInput style={styles.Input} value={dogName} onChangeText={setDogName} />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.login2}>sex</Text>
                        <TextInput style={styles.Input} value={dogSex} onChangeText={setDogSex} />
                    </View>
                </View>
                <View style={styles.row}>
                <View style={styles.row}>
                        <Text style={styles.login2}>breed</Text>
                        <TextInput style={styles.Input} value={dogBreed} onChangeText={setDogBreed} />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.login2}>age</Text>
                        <TextInput style={styles.Input} value={dogAge} onChangeText={setDogAge} />
                    </View>
                </View>
          </View>
            
          <View>
            <TouchableOpacity style={styles.btn1Align} activeOpacity={0.5} onPress={fetchMoreInfo} >
                <Text style={styles.btnStyle}>다음 단계로</Text>
            </TouchableOpacity>
          </View>


        </ImageBackground>
        { modal ? 
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
              
            }}
          >
            <TouchableOpacity style={{ flexDirection: 'row'}} onPress={onLaunchCamera}>
              <View 
                style={{ 
                width :'100%',
                height: 40,
                backgroundColor: "yellow",
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems :'center',
                }}>
                    <Text>아이콘</Text>
                    <Text style={{fontWeight: 'bold'}}>카메라로 촬영하기</Text>   
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row'}} onPress={onLaunchImageLibrary}>
            <View
              style={{ 
                width :'100%',
                height: 40,
                backgroundColor: "green",
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems :'center',
                }}
            >
              <Text>아이콘</Text>
              <Text style={{fontWeight: 'bold'}}>갤러리에서 선택</Text>
            </View>
            </TouchableOpacity>
          </View>
          :null }
      </KeyboardAvoidingView>

  );
}

const { width: WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
   
  row: { flexDirection:'row', marginTop:5, justifyContent: 'space-evenly', },
  header: { flex: 1 },
  bgImage: { width: '100%', height: '100%' },

  btn1Align: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  btnStyle: {
    backgroundColor: '#6A74CF',
    width: WIDTH * 0.7,

    height: 40,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 77,
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    color: 'white',
    alignSelf: 'center',
  },
  login2: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    marginRight: 10,
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
    borderRadius: 77,
  },
  

});

export default MoreInfo;
