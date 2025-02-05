import React from 'react';
import {getToken, deleteToken} from '../../utils/authStorage';
import {useAuth} from '../../context/AuthContext';
import {View, Button} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';

const LogOut = ({setIsLoggedIn}) => {
  const {logout} = useAuth();
  const navigation = useNavigation();

  const resetNavigation = ({navigation}) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Profiles'}], // Replace with your desired initial screen
      }),
    );
  };

  const handleLogOut = async () => {
    await deleteToken();

    const token = await getToken();
    if (!token) {
      logout();
      setIsLoggedIn(false);
      resetNavigation({navigation});
    }
  };
  return (
    <View>
      <Button title="LogOut" onPress={handleLogOut} />
    </View>
  );
};

export default LogOut;
