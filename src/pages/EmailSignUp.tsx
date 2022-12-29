import React from 'react';
import {TextInput, Text, View, Button} from 'react-native';

function EmailSignUp() {
  return (
    <>
      <View>
        <Text>이메일회원가입페이지</Text>
      </View>
      <View>
        <View>
          <Text>이름</Text>
          <TextInput placeholder="이름입력칸">이름입력칸</TextInput>
          <Text>성별</Text>
          <Button title="남성" />
          <Button title="여성" />
        </View>
        <View>
          <Text>이메일</Text>
          <TextInput>이메일입력칸</TextInput>
        </View>
        <View>
          <Text>비밀번호</Text>
          <TextInput>비밀번호입력칸</TextInput>
          <Text>비밀번호확인</Text>
          <TextInput>비밀번호확인입력칸</TextInput>
        </View>
      </View>
    </>
  );
}

export default EmailSignUp;
