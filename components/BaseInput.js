import React, { Component } from 'react';
import { TextInput } from 'react-native';

export default function BaseInput(props) {
  return (
    <TextInput
      {...props}
      style={{
        height: 50,
        padding: 10,
        borderColor: '#dadada',
        borderWidth: 1,
        ...props.style,
      }}
    />
  );
}
