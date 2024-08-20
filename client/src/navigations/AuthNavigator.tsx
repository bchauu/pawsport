import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateScreen from '../screens/CreateScreen';
import LoginScreen from '../screens/LoginScreen';
import SearchSuggestionScreen from '../screens/SearchSuggestScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Create" component={CreateScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
