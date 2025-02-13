import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  View,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {storeToken, getToken} from '../../utils/authStorage';
import useApiConfig from '../../utils/apiConfig';
import config from '../../config';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useSocketContext} from '../../context/SocketContext';
import {useTheme} from '../../context/ThemeContext';

const LoginField = () => {
  const {theme} = useTheme();
  const {reconnectSocket} = useSocketContext();
  const {login} = useAuth();
  const {setToken, apiUrl} = useApiConfig();
  const navigation = useNavigation(); // Get navigation object
  const [cred, setCred] = useState({
    email: '',
    password: '',
  });

  const handleChange = (credName: string, value: string) => {
    setCred(prevState => ({
      ...prevState,
      [credName]: value,
    }));
  };

  const resetNavigation = ({navigation}) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Search'}], // Replace with your desired initial screen
      }),
    );
  };

  const handleLogin = async () => {
    try {
      const {apiUrl} = await config();
      const response = await axios.post(`${apiUrl}/api/users/login`, cred);
      if (response.status === 200) {
        const {token} = response.data;
        console.log(token, 'token and log in');
        setToken(token);
        await storeToken(token);
        console.log('successfully stored token');
        const test = await getToken();
        console.log(test);
      } else {
        console.log('Login Failed', response.data.message);
      }
      login();
      const token = await getToken();
      console.log('Before reset:', token, apiUrl);
      resetNavigation({navigation});
      setTimeout(() => {
        console.log('After reset:', token, apiUrl);
      }, 1000);
      setTimeout(() => {
        reconnectSocket();
      }, 250);
    } catch (error: any) {
      console.log('error message', error);
      Alert.alert('Error Message:', 'Error loggin in.');

      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        Alert.alert(
          'Login Failed',
          error.response.data.message || 'An error occurred during login.',
        );
      } else if (error.request) {
        // The request was made, but no response was received
        console.error('No response received:', error.request);
        Alert.alert(
          'Login Failed',
          'No response from server. Please check your network connection.',
        );
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error setting up request:', error.message);
        Alert.alert(
          'Login Failed',
          error.message || 'An unknown error occurred.',
        );
      }
    }
  };

  return (
    <View style={theme.lists.authContainer}>
      <TextInput
        placeholder="Email"
        value={cred.email}
        onChangeText={value => handleChange('email', value)}
        style={[theme.inputs.auth]}
      />
      <TextInput
        placeholder="Password"
        value={cred.password}
        onChangeText={value => handleChange('password', value)}
        style={[theme.inputs.auth]}
      />
      <View style={theme.buttons.base}>
        <TouchableOpacity
          onPress={handleLogin}
          style={[theme.buttons.primary, theme.buttons.auth]}>
          <Text style={theme.buttons.text}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginField;
