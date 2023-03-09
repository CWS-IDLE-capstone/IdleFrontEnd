import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

interface AddInfoProps {
  accessToken: string;
}

function AddInfo({accessToken}: AddInfoProps) {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [sex, setSex] = useState('');

  const handleSubmit = async () => {
    const userInfo = {
      name,
      nickname,
      imageUrl,
      location,
      sex,
    };

    const url =
      'http://awsv4-env.eba-mre2mcnv.ap-northeast-2.elasticbeanstalk.com/api/user/addInfo';
    try {
      console.log('작동');
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <View>
      <View>
        <Text>Name:</Text>
        <TextInput value={name} onChangeText={setName} />
      </View>
      <View>
        <Text>Nickname:</Text>
        <TextInput value={nickname} onChangeText={setNickname} />
      </View>
      <View>
        <Text>Image URL:</Text>
        <TextInput value={imageUrl} onChangeText={setImageUrl} />
      </View>
      <View>
        <Text>Location:</Text>
        <TextInput value={location} onChangeText={setLocation} />
      </View>
      <View>
        <Text>Sex:</Text>
        <TextInput value={sex} onChangeText={setSex} />
      </View>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

export default AddInfo;
