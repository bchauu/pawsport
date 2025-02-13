// utils/apiConfig.js

import {useState, useEffect} from 'react';
import {getToken, deleteToken} from './authStorage';
import config from '../config';
import {useNavigation} from '@react-navigation/native';
import {decode} from 'base-64';

const useApiConfig = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [token, setToken] = useState('');
  const navigation = useNavigation();

  const parseJwt = token => {
    try {
      const base64Url = token.split('.')[1]; // Get payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Fix encoding
      const decodedPayload = decode(base64); // Decode Base64
      return JSON.parse(decodedPayload); // Convert to JSON
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  };

  const fetchConfig = async () => {
    try {
      const fetchedToken = await getToken(); // Fetch token from storage
      const {apiUrl: fetchedApiUrl} = await config(); // Fetch API URL

      if (fetchedToken) {
        console.log(fetchedToken, 'fetchedToken');
        try {
          const decoded = parseJwt(fetchedToken); // Decode token  --> this is error
          console.log(decoded, 'decoded in apiconfig');
          const currentTime = Date.now() / 1000; // Convert to seconds

          if (decoded.exp < currentTime) {
            console.log('🔴 Token expired! Logging out...');
            setToken(null); // Clear token state
            await deleteToken(); // Remove token from storage
            navigation.navigate('Profiles'); // Redirect to login
            return; // Stop execution
          }
        } catch (decodeError) {
          console.log('❌ Invalid token format:', decodeError);
          setToken(null);
          await deleteToken();
          navigation.navigate('Profiles');
          return;
        }
      }

      setToken(fetchedToken); // ✅ Only set the token if it's still valid
      setApiUrl(fetchedApiUrl);
    } catch (error) {
      console.error('❌ Error fetching API config:', error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {apiUrl, token, setToken};
};

export default useApiConfig;

//compare to original and see whats changed
//right now its existing but jwt decoding is not decoding and throwing the error
//either its not used correctly
//can do another method or skip that part
