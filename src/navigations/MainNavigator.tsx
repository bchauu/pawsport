import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileScreen from '../screens/ProfileScreen';
import HomeStackNavigator from './HomeStackNavigator';
import TripStackNavigator from './TripStackNavigator';
import {TripProvider} from '../context/TripContext';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, color, size) => {
  let iconName;

  switch (routeName) {
    case 'Search':
      iconName = 'search'; // Icon for Search tab
      break;
    case 'Trips':
      iconName = 'flight'; // Icon for Trips tab (plane icon)
      break;
    case 'Profiles':
      iconName = 'person'; // Icon for Profiles tab
      break;
    default:
      iconName = 'circle'; // Fallback icon
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const MainNavigator = () => {
  const screenOptions = ({route}) => ({
    tabBarIcon: ({color, size}) => getTabBarIcon(route.name, color, size),
    tabBarActiveTintColor: 'blue', // Color for active tab
    tabBarInactiveTintColor: 'gray', // Color for inactive tab
  });

  return (
    <TripProvider>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Search" component={HomeStackNavigator} />
        <Tab.Screen name="Trips" component={TripStackNavigator} />
        <Tab.Screen name="Profiles" component={ProfileScreen} />
      </Tab.Navigator>
    </TripProvider>
  );
};

export default MainNavigator;
