import React, {useEffect} from 'react';
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import Search from '../component/home/Search';
import Recommendations from '../component/home/Recommendations';
import {useSocketContext} from '../context/SocketContext';
import {useEmittedItems} from '../context/EmittedItemsContext';
import {useTravelList} from '../context/AllTravelListContext';
import {useTheme} from '../context/ThemeContext';
import useApiConfig from '../utils/apiConfig';
import {useApiConfigContext} from '../context/ApiConfigContext';
import axios from 'axios';

const HomeScreen = () => {
  const {theme} = useTheme();
  const {socket} = useSocketContext();
  const {emittedItems, setEmittedItems} = useEmittedItems();
  const {allTravelList, setAllTravelList} = useTravelList();
  // const {apiUrl, token} = useApiConfig();
  const {apiUrl, token} = useApiConfigContext();

  useEffect(() => {
    // console.log(token, apiUrl, 'homescreen');
    if (token && apiUrl) {
      try {
        const getList = async () => {
          const response = await axios.get(`${apiUrl}/trips/lists/places`, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          // console.log(response, 'getlist response');
          setAllTravelList([...response.data.travelLists]);
        };
        getList();
        // console.log('getting list in places');
      } catch (error) {
        console.log(error, 'error in home screen fetching list');
      }
    }
  }, [token, apiUrl]);

  const test = () => {
    console.log(allTravelList, 'allTravelList in home');
  };

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
  }, [socket, apiUrl, token]);

  return (
    <ScrollView style={[styles.scrollContainer]}>
      <View style={styles.container}>
        {/* <Button onPress={test} title="test" /> */}
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
