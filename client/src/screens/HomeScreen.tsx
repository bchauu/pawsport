import React from 'react';
import {View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import Search from '../components/home/Search';
import Recommendations from '../components/home/Recommendations';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const {theme} = useTheme();
  return (
    <ScrollView style={[styles.scrollContainer, ]}>
      <View style={styles.container}>
        <Search></Search>
        <Recommendations></Recommendations>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 16, // Use vertical padding for better spacing
  },
  container: {
    // padding: 0,
  },
  text: {
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
