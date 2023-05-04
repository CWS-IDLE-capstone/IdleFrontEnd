import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
// import {useUserContext} from '../components/UserContext';
import {useNavigation} from '@react-navigation/native';
import IconRightButton from '../components/IconRightButton';
import DaonBtn from '../components/daonBtn';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
function MyPage({navigation}: any) {
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
  return (
    <View>
      <DaonBtn text="정보수정" onPress={onUpdateUser} />
    </View>
  );
}
export default MyPage;
