/* eslint-disable react/self-closing-comp */
import React, {useState} from 'react';
import {
  View,
  Switch,
  StyleSheet,
  Pressable,
  Text,
  Platform,
} from 'react-native';

function Setting() {
  const [allNotification, setAllNotification] = useState(true);
  const onSetAllNotification = () => {
    setAllNotification((pre: any) => !pre);
  };

  const [addFriend, setAddFriend] = useState(true);
  const onSetAddFriend = () => {
    setAddFriend((pre: any) => !pre);
  };
  const [friendWalk, setFriendWalk] = useState(true);
  const onSetFriendWalk = () => {
    setFriendWalk((pre: any) => !pre);
  };
  const [eventNoti, setEventNoti] = useState(true);
  const onSetEventNoti = () => {
    setEventNoti((pre: any) => !pre);
  };
  const [notice, setNotice] = useState(true);
  const onSetNotice = () => {
    setNotice((pre: any) => !pre);
  };
  return (
    <>
      <View style={styles.block}>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
            {borderBottomWidth: 1.5},
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>전체 알림</Text>
          <Switch
            trackColor={{false: '#767577', true: '#8AA2F8'}}
            thumbColor={allNotification ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSetAllNotification}
            value={allNotification}
          />
        </Pressable>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>친구 신청</Text>
          <Switch
            trackColor={{false: '#767577', true: '#8AA2F8'}}
            thumbColor={addFriend ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSetAddFriend}
            value={addFriend}
          />
        </Pressable>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>친구 산책</Text>
          <Switch
            trackColor={{false: '#767577', true: '#8AA2F8'}}
            thumbColor={friendWalk ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSetFriendWalk}
            value={friendWalk}
          />
        </Pressable>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>혜택 이벤트 알림</Text>
          <Switch
            trackColor={{false: '#767577', true: '#8AA2F8'}}
            thumbColor={eventNoti ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSetEventNoti}
            value={eventNoti}
          />
        </Pressable>
        <Pressable
          // onPress={onLogout}
          style={pressed => [
            styles.item,
            pressed && Platform.select({ios: {opacity: 0.5}}),
          ]}
          android_ripple={{
            color: '#eee',
          }}>
          <Text style={styles.itemText}>공지사항</Text>
          <Switch
            trackColor={{false: '#767577', true: '#8AA2F8'}}
            thumbColor={notice ? 'white' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSetNotice}
            value={notice}
          />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: 'black',
  },
  logout: {
    justifyContent: 'flex-end',
  },
});

export default Setting;
