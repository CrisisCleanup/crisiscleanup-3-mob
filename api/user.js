import { AsyncStorage } from 'react-native';
import axios from 'axios';
import store from '../store';

export const login = async (email, password) => {
  const response = await axios.post(
    `https://api.dev.crisiscleanup.io/api-token-auth`,
    {
      email,
      password,
    },
  );
  await AsyncStorage.setItem('@accessToken', response.data.access_token);
  return response.data;
};

export const getMe = async () => {
  const accessToken = await AsyncStorage.getItem('@accessToken');
  try {
    const response = await axios.get(
      `https://api.dev.crisiscleanup.io/users/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (e) {
    await AsyncStorage.removeItem('@accessToken');
    store.dispatch({ type: 'SET_ACCESS_TOKEN', token: null });
  }
};
