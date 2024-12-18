import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import TripsScreen from '../screens/TripsScreen';
import CoopTripsScreen from '../screens/CoopTripsScreen';
import { SearchProvider } from '../context/SearchContext';
import flipAnimation from '../styles/flipAnimation'

type TripStackParamList = {
  Trip: undefined;
  CoopTrips: { handleSubmit: () => Promise<void> };
};

const TripStack = createStackNavigator<TripStackParamList>();

const TripStackNavigator = () => {
  return (
    <SearchProvider>
            <TripStack.Navigator initialRouteName="Trip" screenOptions={{ headerShown: false, ...flipAnimation }}>
            <TripStack.Screen name="Trip" component={TripsScreen} />
            <TripStack.Screen name="CoopTrips" component={CoopTripsScreen} />
            </TripStack.Navigator>
    </SearchProvider>
  );
};
//renders 'home' stack
export default TripStackNavigator;
