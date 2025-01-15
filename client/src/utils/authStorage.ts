import SInfo from 'react-native-sensitive-info';

const STORAGE_OPTIONS = {
  sharedPreferencesName: 'mySharedPrefs',
  keychainService: 'myKeychain',
};

let cachedToken = null;

// Get the token
export const getToken = async () => {
  try {
    if (cachedToken) {
      // console.log('Token retrieved from cache:', cachedToken);
      return cachedToken;
    }

    const token = await SInfo.getItem('jwtToken', STORAGE_OPTIONS);
    if (token) {
      cachedToken = token; // Cache the token in memory
      // console.log('Token retrieved from storage:', token);
      return token;
    } else {
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Store the token
export const storeToken = async (token) => {
  try {
    await SInfo.setItem('jwtToken', token, STORAGE_OPTIONS);
    cachedToken = token; // Update the in-memory cache
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Error storing the token:', error);
  }
};

// Delete the token
export const deleteToken = async () => {
  try {
    cachedToken = null; // Clear the cache
    await SInfo.deleteItem('jwtToken', STORAGE_OPTIONS);
    console.log('Successfully removed token');
  } catch (error) {
    console.error('Error deleting token:', error);
    return null;
  }
};