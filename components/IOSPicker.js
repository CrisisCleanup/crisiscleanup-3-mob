import React from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Picker,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  View,
} from 'react-native';

const { width: WindowWidth } = Dimensions.get('window');

export function IOSPicker(props) {
  const [modalIsVisible, setModalIsVisible] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState('1:00');
  const [modalAnimatedValue, setModalAnimatedValue] = React.useState(
    new Animated.Value(0),
  );

  const _handlePressDone = () => {
    Animated.timing(modalAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setModalIsVisible(false);
    });
  };

  const opacity = modalAnimatedValue;
  const translateY = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={modalIsVisible ? 'auto' : 'none'}
    >
      <TouchableWithoutFeedback onPress={_handlePressDone}>
        <Animated.View style={[styles.overlay, { opacity }]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          transform: [{ translateY }],
        }}
      >
        <View style={styles.toolbar}>
          <View style={styles.toolbarRight}>
            <Button title="Done" onPress={_handlePressDone} />
          </View>
        </View>
        <View style={{ width: WindowWidth, flexDirection: 'row', flex: 1 }}>
          <Picker
            style={{ width: WindowWidth, backgroundColor: '#e1e1e1', flex: 1 }}
            selectedValue={selectedValue}
            onValueChange={(itemValue) => console.log(itemValue)}
          >
            <Picker.Item label="1:00" value="1:00" />
            <Picker.Item label="2:00" value="2:00" />
            <Picker.Item label="3:00" value="3:00" />
            <Picker.Item label="4:00" value="4:00" />
            <Picker.Item label="5:00" value="5:00" />
            <Picker.Item label="6:00" value="6:00" />
            <Picker.Item label="7:00" value="7:00" />
            <Picker.Item label="7:00" value="8:00" />
            <Picker.Item label="9:00" value="9:00" />
            <Picker.Item label="10:00" value="10:00" />
            <Picker.Item label="11:00" value="11:00" />
            <Picker.Item label="12:00" value="12:00" />
          </Picker>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  toolbar: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  toolbarRight: {
    alignSelf: 'flex-end',
  },
});
