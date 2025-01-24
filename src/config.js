import {NetworkInfo} from 'react-native-network-info';

const config = async () => {
  try {
    // const ipAddress = await NetworkInfo.getIPAddress();
    const ipAddress = '172.20.10.2';
    return {
      apiUrl: `http://${ipAddress}:3000`,
    };
  } catch (error) {
    console.error('Error getting IP address:', error);
    return null;
  }
};

export default config;
