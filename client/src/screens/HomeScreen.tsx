import React from 'react';
import {View, Text, Button } from 'react-native';
import Search from '../components/home/Search';
import Recommendations from '../components/home/Recommendations';

const HomeScreen = () => {
  return (
    <View>
      <Text>Home Screens</Text>
      <Search></Search>
      <Recommendations></Recommendations>
    </View>
  );
};

export default HomeScreen;
