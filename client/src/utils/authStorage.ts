import SInfo from 'react-native-sensitive-info';

const STORAGE_OPTIONS = {
  sharedPreferencesName: 'mySharedPrefs',
  keychainService: 'myKeychain',
};

export const storeToken = async (token: string): Promise<void> => {
  try {
    await SInfo.setItem('jwtToken', token, STORAGE_OPTIONS);
    console.log('Token stored successfully');
  } catch (error) {
    console.error('Error storing the token', error);
  }
};

export const getToken = async () => {
  try {
    const token = await SInfo.getItem('jwtToken', STORAGE_OPTIONS);
    if (token !== null) {
      console.log('Token retrieved successfully:', token);
      return token;
    } else {
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving the token', error);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    await SInfo.deleteItem('jwtToken', STORAGE_OPTIONS);
    console.log('Successfully removed token');
  } catch (error) {
    console.error('Error deleting token', error);
    return null;
  }
};