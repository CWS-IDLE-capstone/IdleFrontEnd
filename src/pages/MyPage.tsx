import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
// import {useUserContext} from '../components/UserContext';
import {useNavigation} from '@react-navigation/native';
import IconRightButton from '../components/IconRightButton';
function MyPage({navigation}: any) {
  // const {user} = useUserContext();
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
    </View>
  );
}
export default MyPage;
