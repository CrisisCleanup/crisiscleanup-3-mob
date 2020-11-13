import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import LinksScreen from '../screens/LinksScreen';
import Cases from '../screens/Cases';
import { View } from 'react-native-tailwind';
import { StyleSheet, Platform } from 'react-native';
import CaseForm from '../screens/CaseForm';
const BottomTab = createBottomTabNavigator();
const SettingsScreenStack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

function CasesPagesNavigator({ navigation }) {
  navigation.setOptions({ headerTitle: null });
  let screenOptions = {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };
  if (Platform.OS === 'ios') {
    screenOptions.safeAreaInsets = { top: 0, bottom: 0 };
  }
  return (
    <View style={{ height: '100%' }}>
      <SettingsScreenStack.Navigator
        initialRouteName="Cases"
        screenOptions={screenOptions}
      >
        <SettingsScreenStack.Screen
          name="Cases"
          component={Cases}
          options={{
            title: 'Cases',
            headerShown: false,
          }}
        />
        <SettingsScreenStack.Screen
          name="CaseForm"
          component={CaseForm}
          options={{
            title: 'New Case',
            headerShown: true,
            headerRightContainerStyle: {
              marginRight: 10,
            },
          }}
        />
      </SettingsScreenStack.Navigator>
    </View>
  );
}

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  return (
    <View style={{ height: '100%' }}>
      <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
        <BottomTab.Screen
          name="Home"
          component={CasesPagesNavigator}
          options={{
            title: 'Work',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                image={require('../assets/images/case-notactive.png')}
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Links"
          component={LinksScreen}
          options={{
            title: 'Resources',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                image={require('../assets/images/case-notactive.png')}
              />
            ),
          }}
        />
      </BottomTab.Navigator>
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
