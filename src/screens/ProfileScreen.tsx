import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LogOut from '../component/account/LogOut';
import LoginField from '../component/account/LoginField';
import CreateAccountForm from '../component/account/CreateAccountForm';
import useApiConfig from '../utils/apiConfig';

const ProfileScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const {token} = useApiConfig();

  const handleCreateAccount = (data: {
    // this should go to useAuth and then send to backend to register and authenticate
    username: string;
    email: string;
    password: string;
  }) => {
    console.log('Account has been created with:', data);
  };

  useEffect(() => {
    if (token) {
      console.log(token, 'should exist after logging in');
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <View>
      <Text>Account</Text>
      {isLoggedIn ? (
        <LogOut setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <View>
          {isCreateAccount ? (
            <View>
              <CreateAccountForm onSubmit={handleCreateAccount} />
              <TouchableOpacity
                onPress={() => setIsCreateAccount(prev => !prev)}>
                <Text>Login Instead</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <LoginField />
              <TouchableOpacity
                onPress={() => setIsCreateAccount(prev => !prev)}>
                <Text>Create an Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: spacing.padding,
    // backgroundColor: colors.background,
  },
  authContainer: {
    width: '100%',
    // padding: spacing.padding,
    // backgroundColor: colors.buttonBackground,
    borderRadius: 10,
    // ...shadow,
  },
  toggleButton: {
    // ...button,
  },
  toggleText: {
    // ...typography.buttonText,
    // color: colors.buttonText,
  },
});

export default ProfileScreen;
