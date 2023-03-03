import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
// import {useUserContext} from '../components/UserContext';
import {useNavigation} from '@react-navigation/native';
import IconRightButton from '../components/IconRightButton';
import DaonBtn from '../components/daonBtn';
function MyPage({navigation}: any) {
  // const {user} = useUserContext();
  const onUpdateUser = () => {
    //TODO: 정보수정페이지로
    // navigation.navigate("")
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
      <Text>MyPage</Text>
      <DaonBtn text="정보수정" onPress={onUpdateUser} />
    </View>
  );
}
export default MyPage;
