import React from 'react';
import {View, Text} from 'react-native';
// import LogOut from '../components/account/LogOut';
import LogOut from '../component/account/LogOut';
import LoginField from '../component/account/LoginField';

const ProfileScreen = () => {
  return (
    <View>
      <Text>Profile Screen</Text>
      <LoginField />
      <LogOut />
    </View>
  );
};

export default ProfileScreen;
