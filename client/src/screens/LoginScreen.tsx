import React from 'react';
import {View, Text, Button} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LoginField from '../components/account/LoginField';
import { AuthStackParamList } from 'src/types/types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View>
      <LoginField></LoginField>
      <Button
        title='Create an Account Here'
        onPress={()=> navigation.navigate('Create')}
        ></Button>
    </View>
  );
};

export default LoginScreen;
