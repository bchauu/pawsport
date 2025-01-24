import React, {useState} from 'react';
import axios from 'axios';
import {View, Button, TextInput, Alert} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {storeToken, getToken} from '../utils/authStorage';
import config from '../config';

const LoginField = () => {
  const {login} = useAuth();
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

  const handleLogin = async () => {
    try {
      const {apiUrl} = await config();
      const response = await axios.post(`${apiUrl}/api/users/login`, cred);
      if (response.status === 200) {
        const {token} = response.data;
        await storeToken(token);
        console.log('successfully stored token');
        const test = await getToken();
        console.log(test);
      } else {
        console.log('Login Failed', response.data.message);
      }
      login();
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
    <View>
      <TextInput
        placeholder="Email"
        value={cred.email}
        onChangeText={value => handleChange('email', value)}
      />
      <TextInput
        placeholder="Password"
        value={cred.password}
        onChangeText={value => handleChange('password', value)}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginField;
