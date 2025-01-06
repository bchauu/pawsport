import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigations/AppNavigator';
import {AuthProvider} from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TravelListProvider } from './context/AllTravelListContext';
import { AllTripsProvider } from './context/AllTripsContext';
import {ApiConfigProvider} from './context/ApiConfigContext'

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ApiConfigProvider>
          <TravelListProvider>
            <AllTripsProvider>
              <ThemeProvider>
                <NavigationContainer>
                  <AppNavigator/>
                </NavigationContainer>
              </ThemeProvider>
            </AllTripsProvider>
          </TravelListProvider>
        </ApiConfigProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
