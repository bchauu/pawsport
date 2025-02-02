import React from 'react';
import {getToken, deleteToken} from '../../utils/authStorage';
import {useAuth} from '../../context/AuthContext';
import {View, Button} from 'react-native';

const LogOut = ({setIsLoggedIn}) => {
  const {logout} = useAuth();
  const handleLogOut = async () => {
    await deleteToken();

    const token = await getToken();
    if (!token) {
      logout();
      setIsLoggedIn(false);
    }
  };
  return (
    <View>
      <Button title="LogOut" onPress={handleLogOut} />
    </View>
  );
};

export default LogOut;
