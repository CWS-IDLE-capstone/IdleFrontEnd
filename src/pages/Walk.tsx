//Walk.tsx

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const WalkScreen = ({route}: any) => {
  const {date} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.date}>산책기록!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
});

export default WalkScreen;
