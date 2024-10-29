// utils/apiConfig.js

import { useState, useEffect } from 'react';
import { getToken } from './authStorage'; // Adjust the path according to your project structure
import config from '../config'; // Adjust the path according to your project structure

const useApiConfig = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const fetchedToken = await getToken(); // Fetch token
        const { apiUrl: fetchedApiUrl } = await config(); // Fetch apiUrl from config

        setToken(fetchedToken);
        setApiUrl(fetchedApiUrl);
      } catch (error) {
        console.error('Error fetching API config:', error);
      }
    };

    fetchConfig();
  }, []);

  return { apiUrl, token };
};

export default useApiConfig;