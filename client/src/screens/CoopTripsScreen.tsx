import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import CoopTrips from '../components/coopTrips/CoopTrips';
import Chat from '../components/coopTrips/Chat';
import axios from 'axios';
import config from '../../src/config';
import { getToken } from '../utils/authStorage';
import MyMap from '../components/trips/Map';
import TravelListDropdown from '../components/trips/TravelListDropDown';
import { useNavigation } from "@react-navigation/native";

const CoopTripsScreen = () => {
  const navigation = useNavigation();

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const [allTravelList, setAllTravelList] = useState([]);
  const [isCreateNewList, setIsCreateNewList] = useState(false);
  const [InputName, setInputName] = useState(''); 
  const [hasNewList, setHasNewList] = useState(false); 
  const [selectedTrip, setSelectedTrip] = useState(null); 
  const [isInitialList, setIsInitialList] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [chat, setChat] = useState([]);

  const getList = async () => {
    const token = await getToken();
    const { apiUrl } = await config();
    const response = await axios.get(`${apiUrl}/trips/lists/places`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    setAllTravelList([...response.data.travelLists]);
    setIsInitialList(true);
  };

  const handleSelect = (trip) => {
    setSelectedTrip(trip);
  };

  const handleNavigateToCoopTrips = () => {
    navigation.navigate('Trip');
  };

  useEffect(() => { 
    getList();
  }, []);

  useEffect(() => {
    if (!selectedTrip) {
      setSelectedTrip(allTravelList[1]);
    } 
  }, [isInitialList]);

  useEffect(() => { 
    const fetchList = async () => {
      if (hasNewList) {
        try {
          await delay(500); 
          await getList();
        } finally {
          setHasNewList(false);
        }
      }
    };
    fetchList();
  }, [hasNewList]);

  useEffect(() => { 
    if (isCreateNewList) {
      const postList = async () => {
        const token = await getToken();
        const { apiUrl } = await config();
        const response = await axios.post(`${apiUrl}/trips/list`, {
          name: InputName,
        }, {
          headers: {
            'authorization': `Bearer ${token}`
          }
        });

        setIsCreateNewList(false);
        setInputName('');
        setHasNewList(true);
      };
      postList();
    }
  }, [isCreateNewList]);

  // List of items that will be rendered in the FlatList
  const renderItem = () => (
    <View>
      <Text style={styles.header}>Coop Trips</Text>
      
      {/* Button as TouchableOpacity */}
      <TouchableOpacity style={styles.button} onPress={() => { handleNavigateToCoopTrips() }}>
        <Text style={styles.buttonText}>Trips</Text>
      </TouchableOpacity>

      <TravelListDropdown
        allTravelList={allTravelList}
        selectedTrip={selectedTrip}
        setSelectedTrip={setSelectedTrip}
        handleSelect={handleSelect}
      />
      <CoopTrips trip={selectedTrip} />

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MyMap selectedTrip={selectedTrip} />
      </View>

      {/* Chat Container */}
      <View style={styles.chatContainer}>
        <ChatMessages chat={chat} userEmail={userEmail} />
        <Chat
          userEmail={userEmail}
          setUserEmail={setUserEmail}
          chat={chat}
          setChat={setChat}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ key: 'content' }]}  // FlatList requires a data array
      renderItem={renderItem}       // The single renderItem function for all content
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  mapContainer: {
    height: 300,  // Fixed height for the map
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  chatContainer: {
    flexShrink: 0,
    marginTop: 10,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

export default CoopTripsScreen;