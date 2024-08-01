import React, {useEffect, useState} from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';
import { getToken } from '../utils/authStorage';
import config from '../../src/config';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';

const AppNavigator = () => {
  //check for token first, if token exist, then login which sets isAuthenticated to true
  const {login, isAuthenticated} = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkToken = async () => {
     const token = await getToken();

     try {
        console.log('try block')
       const response = await axios.get(`${config.apiUrl}/navigate`, {
          headers: {
            'authorization': `Bearer ${token}`
          }
       });
       console.log(response.data.message)
       if (response) login();
     } catch (error: any) {
          console.log(error, 'here')
       if (error.response.data.error === 'Token expired') {
          Alert.alert('Please log in again');
          //already on login page, no need to redirect to another screen
       }
     }

      setLoading(false);
    }

    checkToken();
  },[login]);

  if (loading) return <LoadingScreen/>

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
