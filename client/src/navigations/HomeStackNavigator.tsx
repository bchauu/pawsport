import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SuggestScreen from '../screens/SearchSuggestScreen';
import { SearchProvider } from '../context/SearchContext';

type HomeStackParamList = {
  Home: undefined;
  Suggest: { handleSubmit: () => Promise<void> };
};

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <SearchProvider>
            <HomeStack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />   
            <HomeStack.Screen name="Suggest" component={SuggestScreen} />
            </HomeStack.Navigator>
    </SearchProvider>
  );
};
//renders 'home' stack
export default HomeStackNavigator;
