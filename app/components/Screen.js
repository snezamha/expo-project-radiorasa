import { View, StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import color from '../misc/color';
const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.APP_BG,
    paddingTop: StatusBar.currentHeight + 25,
  },
});
export default Screen;
