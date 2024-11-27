import React from 'react';
import {View, Text, Button, ScrollView } from 'react-native';
import Search from '../components/home/Search';
import Recommendations from '../components/home/Recommendations';

const HomeScreen = () => {
  return (
    <ScrollView>
      <Search></Search>
      <Recommendations></Recommendations>
    </ScrollView>
  );
};

export default HomeScreen;
