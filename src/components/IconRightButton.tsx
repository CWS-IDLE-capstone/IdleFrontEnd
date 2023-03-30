import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

function IconRightButton({name, color, size, onPress}: any) {
  return (
    <View style={styles.block}>
      <Pressable style={styles.circle} onPress={onPress}>
        <Icon name={name} color={color} size={size} />
      </Pressable>
    </View>
  );
}
IconRightButton.defaultProps = {
  color: '#ff8c00',
};

const styles = StyleSheet.create({
  block: {
    marginRight: -2,
    borderRadius: 24,
    overflow: 'hidden',
  },
  circle: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default IconRightButton;
