import * as React from 'react';
import { Platform, StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import store from './store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import { Provider, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import Login from './screens/Login';
import { Ionicons } from '@expo/vector-icons';
import { getMe } from './api/user';
import GlobalStyles from './styles/GlobalStyles';
import CaseForm from './screens/CaseForm';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

const Stack = createStackNavigator();

const App = (props) => {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const dispatch = useDispatch();
  const authStore = useSelector((state) => state.auth);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  React.useEffect(() => {
    async function loadIncidents() {
      try {
        const response = await axios.get(
          `https://api.dev.crisiscleanup.io/incidents`,
          {
            params: {
              fields: 'id,name,short_name,geofence,locations&limit=150',
              ordering: -'start_at',
            },
            headers: {
              Authorization: 'Token 9455d55d653337cabf31942083e5a537b7f8189a',
            },
          },
        );
        dispatch({ type: 'SET_INCIDENTS', incidents: response.data.results });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }

    loadIncidents();
  }, []);

  React.useEffect(() => {
    async function setLogin() {
      try {
        const value = await AsyncStorage.getItem('@accessToken');
        if (value !== null) {
          dispatch({ type: 'SET_ACCESS_TOKEN', token: value });
          const currentUser = await getMe();
          const { incident } = currentUser.states;
          dispatch({
            type: 'SET_CURRENT_INCIDENT',
            incident: incident ? incident : null,
          });
          dispatch({ type: 'SET_USER', user: currentUser });
        }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }

    setLogin();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else if (!authStore.accessToken) {
    return <Login />;
  } else {
    return (
      <ActionSheetProvider>
        <SafeAreaView
          style={{ ...GlobalStyles.AndroidSafeArea, ...styles.container }}
        >
          {Platform.OS === 'ios' && (
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          )}
          <NavigationContainer
            ref={containerRef}
            initialState={initialNavigationState}
          >
            <Stack.Navigator>
              <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UserProfile"
                component={CaseForm}
                options={{
                  title: 'User Profile',
                  headerShown: true,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </ActionSheetProvider>
    );
  }
};

export default function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
