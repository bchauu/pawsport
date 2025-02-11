import React from 'react';
import {getToken, deleteToken} from '../../utils/authStorage';
import {useAuth} from '../../context/AuthContext';
import {View, Button, TouchableOpacity, Text} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';

const LogOut = ({setIsLoggedIn}) => {
  const {logout} = useAuth();
  const navigation = useNavigation();
  const {theme} = useTheme();

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
    <View style={theme.account.button}>
      <TouchableOpacity style={theme.account.logout} onPress={handleLogOut}>
        <Text style={theme.account.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogOut;
