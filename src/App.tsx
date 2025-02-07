import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './navigations/MainNavigator';
import {AuthProvider} from './context/AuthContext';
import {ThemeProvider} from './context/ThemeContext';
import {TravelListProvider} from './context/AllTravelListContext';
import {AllTripsProvider} from './context/AllTripsContext';
import {ApiConfigProvider} from './context/ApiConfigContext';
import {SelectedTripListProvider} from './context/SelectedTripListContext';
import {SocketProvider} from './context/SocketContext';
import {EmittedItemsProvider} from './context/EmittedItemsContext';
import {AddedItemProvider} from './context/AddedItemContext';
const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ApiConfigProvider>
          <SocketProvider>
            <EmittedItemsProvider>
              <AddedItemProvider>
                <TravelListProvider>
                  <SelectedTripListProvider>
                    <AllTripsProvider>
                      <ThemeProvider>
                        <NavigationContainer>
                          <MainNavigator />
                        </NavigationContainer>
                      </ThemeProvider>
                    </AllTripsProvider>
                  </SelectedTripListProvider>
                </TravelListProvider>
              </AddedItemProvider>
            </EmittedItemsProvider>
          </SocketProvider>
        </ApiConfigProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
