import * as React from 'react';

import { Image } from 'react-native';

export default function TabBarIcon(props) {
  return <Image style={{ marginBottom: 5 }} source={props.image} />;
}
