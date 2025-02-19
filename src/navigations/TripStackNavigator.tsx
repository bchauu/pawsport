import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TripsScreen from '../screens/TripScreen';
import {SearchProvider} from '../context/SearchContext';
import flipAnimation from '../styles/flipAnimation';

type TripStackParamList = {
  Trip: undefined;
};

const TripStack = createStackNavigator<TripStackParamList>();

const TripStackNavigator = () => {
  return (
    <SearchProvider>
      <TripStack.Navigator
        initialRouteName="Trip"
        screenOptions={{headerShown: false, ...flipAnimation}}>
        <TripStack.Screen
          name="Trip"
          component={TripsScreen}
          options={{headerShown: false}}
        />
      </TripStack.Navigator>
    </SearchProvider>
  );
};
//renders 'home' stack
export default TripStackNavigator;
