import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigations/AppNavigator';
import {AuthProvider} from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TravelListProvider } from './context/AllTravelListContext';
import { AllTripsProvider } from './context/AllTripsContext';
import {ApiConfigProvider} from './context/ApiConfigContext';
import {SelectedTripListProvider} from './context/SelectedTripListContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ApiConfigProvider>
          <TravelListProvider>
            <SelectedTripListProvider>
              <AllTripsProvider>
                <ThemeProvider>
                  <NavigationContainer>
                    <AppNavigator/>
                  </NavigationContainer>
                </ThemeProvider>
              </AllTripsProvider>
            </SelectedTripListProvider>
          </TravelListProvider>
        </ApiConfigProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
