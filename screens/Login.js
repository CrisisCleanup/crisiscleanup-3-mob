import { Text, View } from 'react-native-tailwind';
import { Image, SafeAreaView, TouchableOpacity } from 'react-native';
import * as React from 'react';
import BaseInput from '../components/BaseInput';
import { login } from '../api/user';
import { useDispatch } from 'react-redux';
import GlobalStyles from '../styles/GlobalStyles';

export default function Login() {
  const [username, onChangeUserName] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const dispatch = useDispatch();

  const loginUser = async () => {
    const loginData = await login(username, password);
    dispatch({
      type: 'LOGIN',
      token: loginData.access_token,
      user: loginData.user_claims,
    });
  };

  return (
    <View>
      <View className="flex items-center justify-center h-full">
        <Image
          style={{
            marginBottom: 5,
            width: 400,
            height: 100,
            resizeMode: 'contain',
            margin: 5,
          }}
          source={require('../assets/images/ccu-logo-black-500w.png')}
        />
        <BaseInput
          placeholder="Email"
          style={{ margin: 5, width: 300 }}
          onChangeText={(text) => onChangeUserName(text)}
        />
        <BaseInput
          placeholder="Password"
          secureTextEntry={true}
          style={{ margin: 5, width: 300 }}
          onChangeText={(text) => onChangePassword(text)}
        />
        <TouchableOpacity onPress={loginUser}>
          <View
            className="my-2 p-4 flex items-center justify-center"
            style={{
              width: 300,
              backgroundColor: '#fece09',
              fontWeight: '700',
            }}
          >
            <Text>Login</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
