import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

const colors = {
  primaryLight: '#fece09',
};

export { colors };
