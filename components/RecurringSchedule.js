import React, { Component } from 'react';
import { Text, View } from 'react-native-tailwind';
import { Modal, SafeAreaView, TouchableOpacity } from 'react-native';

export default function RecurringSchedule(props) {
  const [showSearch, setShowSearch] = React.useState(false);
  return (
    <View>
      <Text>{props.field.label_t}</Text>
      <TouchableOpacity
        onPress={() => {
          setShowSearch(false);
          setShowSearch(true);
        }}
      >
        <View
          style={{
            height: 50,
            padding: 10,
            borderColor: '#dadada',
            borderWidth: 1,
          }}
        ></View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={showSearch}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowSearch(false);
        }}
        onDismiss={() => {
          console.log('here');
          setShowSearch(false);
        }}
      >
        <SafeAreaView>
          <Text>{props.field.label_t}</Text>
          {/*<Header*/}
          {/*    placement="left"*/}
          {/*    leftComponent={{ icon: 'menu', color: '#fff' }}*/}
          {/*    centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}*/}
          {/*    rightComponent={{ icon: 'home', color: '#fff' }}*/}
          {/*/>*/}
        </SafeAreaView>
      </Modal>
    </View>
  );
}
