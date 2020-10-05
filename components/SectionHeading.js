import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native-tailwind';
import { Badge } from 'react-native-elements';
import { colors } from '../styles/GlobalStyles';

const SectionHeading = (props) => {
  return (
    <View className="my-3 flex items-start justify-between text-base font-semibold">
      <View className="flex flex-row items-center text-black">
        <Badge
          value={props.count}
          badgeStyle={{
            backgroundColor: colors.primaryLight,
            width: 25,
            height: 25,
            borderRadius: 80,
          }}
          containerStyle={{ width: 25, height: 25 }}
          textStyle={{ fontSize: 18, color: 'black' }}
        />
        <View style={{ marginLeft: 10 }}>{props.children}</View>
      </View>
    </View>
  );
};
SectionHeading.propTypes = {
  count: PropTypes.number,
  tooltip: PropTypes.string,
};
SectionHeading.defaultProps = { count: 1, tooltip: '' };
export default SectionHeading;
