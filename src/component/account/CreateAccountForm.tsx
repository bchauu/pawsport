import React, {useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import {View, TextInput, Button, Alert} from 'react-native';
import {storeToken, getToken} from '../../utils/authStorage';
import config from '../../config';

interface FormData {
  username: string;
  email: string;
  password: string;
}

type onSubmit = (data: FormData) => void;

const CreateAccountForm: React.FC<{onSubmit: onSubmit}> = ({onSubmit}) => {
  const {login} = useAuth();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [res, setRes] = useState<string | null>(null);

  const handleChange = (formName: string, value: string) => {
    setForm(prevState => ({
      ...prevState,
      [formName]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = await getToken();
    // const apiUrl = config.apiUrl;
    const {apiUrl} = await config();
    console.log('API URL:', apiUrl);
    console.log(`${apiUrl}/api/users/create-account`);
    try {
      const response = await axios.post(
        `${apiUrl}/api/users/create-account`,
        form,
      );
      if (response.data.message === 'success') {
        setRes(response.data.message);
        storeToken(response.data.token);
        login();
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create account');
    }
    onSubmit(form);
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={form.username}
        onChangeText={value => handleChange('username', value)}
      />
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={value => handleChange('email', value)}
      />
      <TextInput
        placeholder="Password"
        value={form.password}
        onChangeText={value => handleChange('password', value)}
      />
      <Button title="Create Account" onPress={handleSubmit} />
    </View>
  );
};

export default CreateAccountForm;
