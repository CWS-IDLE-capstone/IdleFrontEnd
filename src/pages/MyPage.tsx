import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
// import {useUserContext} from '../components/UserContext';
import {useNavigation} from '@react-navigation/native';
import IconRightButton from '../components/IconRightButton';
import DaonBtn from '../components/daonBtn';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import {RootStackParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {RootState} from '../store/reducer';

const {width: WIDTH} = Dimensions.get('window');
const {height: HEIGHT} = Dimensions.get('window');
type ScreenProps = NativeStackScreenProps<RootStackParamList, 'MoreInfo1'>;
function MyPage({navigation}: ScreenProps) {
  const [response, setResponse] = useState(null);
  const [modal, setModal] = useState(false);
  const [img, setImg] = useState(false);
  const user = useSelector(state => state.user.name);
  const email = useSelector(state => state.user.email);
  //강아지정보받아오기
  // interface DogData {
  //   dogList: Dog[];
  // }
  // interface Dog {
  //   id: number;
  //   breed: string;
  //   imageUrl: string;
  //   dogName: string;
  //   age: number;
  // }
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
        setImg(true);
        setModal(prev => !prev);
        console.log(res.assets[0].uri);
      },
    );
  };
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [data, setData] = useState<DogData | null>({dogList: []});
  useEffect(() => {
    async function getPetInfo() {
      console.log('GET강아지 정보1');
      const token = accessToken;
      // const getUserPet = await axios
      // .get(`${Config.API_URL}/api/dog`)
      fetch(`${Config.API_URL}/api/dog`, {
        method: 'GET',
      })
        .then(resonse => resonse.json())
        .then(resData => {
          console.log('GET강아지 정보3');
          console.log(resData);
          setData(resData.data);
        })
        .catch(error => {
          console.error('GET강아지 정보 에러', error);
        });
    }
    getPetInfo();
  }, []);
  // const {user} = useUserContext();
  const dispatch = useAppDispatch();
  const onUpdateUser = () => {
    //TODO: 정보수정페이지로
    // navigation.navigate("")
    dispatch(
      //리덕스에 넣어주기
      userSlice.actions.setUser({
        name: '',
        email: '',
        accessToken: '',
      }),
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconRightButton
          name="gear"
          size={35}
          color={'black'}
          onPress={() => navigation.navigate('Setting')}
        />
      ),
    });
  });
  // const navigation = useNavigation();
  const onEditPet = useCallback(() => {
    navigation.navigate('MoreInfo1');
  }, [navigation]);
  return (
    <View style={styles.container}>
      {/* <ScrollView style={styles.scrollView}> */}
      <View>
        <View style={styles.userInfo}>
          <View style={styles.userImageView}>
            <View style={styles.userImageCon}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setModal(prev => !prev)}>
                <Image
                  source={
                    img
                      ? {uri: response?.assets[0]?.uri}
                      : require('../assets/icon-dog.png')
                  }
                  style={styles.userImage}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoText}>{user}</Text>
            <Text style={styles.infoEmailText}>{email}</Text>
            {data ? <Text>{data?.dogList[0]?.dogName}</Text> : <Text />}
          </View>
          <View style={styles.editUserPetView}>
            <TouchableOpacity style={styles.editPetBtn} onPress={onEditPet}>
              <Text style={styles.editText}> edit </Text>
              <Image
                source={require('../assets/editBtn.png')}
                style={styles.editImg}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {modal ? (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: 'white',
            width: '60%',
            height: 80,
            alignItems: 'center',
            top: HEIGHT / 5.4,
            marginLeft: 10,
            borderRadius: 5,
            borderWidth: 0.5,
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
                // borderWidth: 0.5,
                borderBottomWidth: 0.5,
              }}>
              {/* <Material
                name="photo-camera"
                style={{
                  fontSize: 25,
                  padding: 4,
                }}
              /> */}
              <Text style={{fontWeight: 'bold', padding: 4, color: 'black'}}>
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
                // borderLeftWidth: 0.5,
                // borderRightWidth: 0.5,
                borderBottomWidth: 0.5,
              }}>
              {/* <Material
                name="photo"
                style={{
                  fontSize: 25,
                  padding: 4,
                }}
              /> */}
              <Text style={{fontWeight: 'bold', padding: 4, color: 'black'}}>
                갤러리에서 선택
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
export default MyPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    width: '100%',
    height: 130,
    marginTop: 30,
    backgroundColor: '#8AA2F865',
    borderRadius: 25,
  },
  userImageView: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 12,
  },
  userImageCon: {
    padding: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    marginRight: 5,
  },
  userImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 25,
    resizeMode: 'cover',
  },
  info: {
    width: 150,
    height: '100%',
    justifyContent: 'center',
  },
  infoText: {
    color: 'black',
    fontWeight: 'bold',
  },
  infoEmailText: {
    fontSize: 10,
    color: 'black',
    marginTop: 10,
  },
  editUserPetView: {
    justifyContent: 'center',
    flex: 1,
    marginRight: 15,
  },
  editPetBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#9a9898',
    // borderColor: 'black',
  },
  editImg: {
    width: 20,
    height: 20,
    opacity: 0.6,
  },
  editText: {
    // color: '#9a9898',
    color: 'black',
  },
  logout: {},
});
