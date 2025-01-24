import React, {useEffect} from 'react';
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import Search from '../component/home/Search';
import Recommendations from '../component/home/Recommendations';
import {useSocketContext} from '../context/SocketContext';
import {useEmittedItems} from '../context/EmittedItemsContext';
import {useTravelList} from '../context/AllTravelListContext';
import {useTheme} from '../context/ThemeContext';

const HomeScreen = () => {
  const {theme} = useTheme();
  const {socket} = useSocketContext();
  const {emittedItems, setEmittedItems} = useEmittedItems();
  const {allTravelList, setAllTravelList} = useTravelList();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('updateListItems', (updatedList, eventAction) => {
      console.log('Updated list received:', updatedList);
      console.log(eventAction, 'test in home');

      setEmittedItems(prev => [...prev, {updatedList, action: eventAction}]); // Update emitted items
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('updateListItems');
    };
  }, [socket]);

  return (
    <ScrollView style={[styles.scrollContainer]}>
      <View style={styles.container}>
        <Search />
        <Recommendations />
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
