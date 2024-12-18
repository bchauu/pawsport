import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button, ScrollView, FlatList, StyleSheet} from 'react-native';
import Trips from '../components/trips/Trips';
import axios from 'axios';
import config from '../../src/config';
import { getToken } from '../utils/authStorage';
import MyMap from '../components/trips/Map';
import CreateTravelListModal from '../components/trips/CreateTravelListModal';
import TravelListDropdown from '../components/trips/TravelListDropDown';
import ChatModal from '../components/trips/Chat/ChatModal';
import { useNavigation } from "@react-navigation/native";
import CollapsibleDropdown from '../components/trips/CollapsibleDropDown';
import { useTheme } from "../context/ThemeContext";
import CollaboratorsModal from "../components/trips/TravelBuddiesButton";
import io from 'socket.io-client';


const TripsScreen =  () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleViewTravlers = () => {
    setIsTravelersViewed((prevState) => !prevState)
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [isTravelersViewed, setIsTravelersViewed] = useState(false);

  const [allTravelList, setAllTravelList] = useState([]);
  const [isCreateNewList, setIsCreateNewList] = useState(false);
  const [InputName, setInputName] = useState(''); //lift state up from modal
  const [hasNewList, setHasNewList] = useState(false); // control rendering of list
  const [selectedTrip, setSelectedTrip] = useState(null);   //entire trip --> this is what should be passed
  const [roomId, setRoomId] = useState('');
  const [isInitialList, setIsInitialList] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null)
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);  
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [sharedListWithUser, setSharedListWithUser] = useState([]);
  const [isSharedList, setIsSharedList] = useState(false);

  const getList = async () => {
    const token = await getToken();
    const { apiUrl } = await config();
    const response = await axios.get(`${apiUrl}/trips/lists/places`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
    });

    console.log(response.data.travelLists, 'getList in TripScreen')
    setAllTravelList((prevList) => [...response.data.travelLists])

    await delay(50)
    setIsInitialList(true)
   
}

  const handleSelect = (trip) => {
    setSelectedTrip(trip);
  };

  const handleNavigateToCoopTrips = () => {
    navigation.navigate('CoopTrips');
  }

  useEffect(() => { //initial
    getList();
  },[])

  useEffect(() => {
    const getSharedList = async () => {
      const token = await getToken();
      const { apiUrl } = await config();
      const response = await axios.get(`${apiUrl}/trips/lists/shared`, {
          headers: {
            'authorization': `Bearer ${token}`
          }
      });
      console.log(response.data.listPermission, 'allTravelList')

      setSharedListWithUser(response.data.listPermission);
    }

    getSharedList();

  }, [])  //query shared list with current user

  useEffect(() => {
    setNewMessageCount(4+1) // for testing

    if(chat.length > 0) {
      setIsNewMessage(true);
    }
  }, [chat])


  // Step 1: Initialize the socket only once
  useEffect(() => {
    console.log('initialize')
    const initializeSocket = async () => {
      const token = await getToken();
      const newSocket = io('http://localhost:3000', {
        query: { token }
      });
      setSocket(newSocket);

      // Cleanup on unmount
      return () =>{
        newSocket.disconnect()
        setIsRoomJoined(false);
        setChat([]);
      };
    };

    if (!socket) {
      initializeSocket();
    }
  }, []);

  useEffect(() => {
    if (socket && selectedTrip) {
        console.log('leaving room useEffect triggered', `${roomId} this room`)
      // Leave previous room if already in one
      // if (roomId) {
      //   socket.emit('leaveRoom', roomId);
      //   socket.off('receiveMessage'); // Cleanup listener for new messages
      // }

      // Join the new room for the selected trip
      socket.emit('joinRoom', { listId: selectedTrip.id }, (response) => {
        if (response.status === 'success') {
          setRoomId(response.roomId); // Update to new room ID
          console.log(`Joined room: ${response.roomId} in tripScreen`);
          setIsRoomJoined(true);
        } else {
          console.error(response.reason);
        }
      });
    }
  }, [selectedTrip]);

  useEffect(() => {
    if (!selectedTrip) {
      setSelectedTrip(allTravelList[0]);
    } 
  },[isInitialList])    //auto pick first (2nd) one on load


  useEffect(() => { //this is to fetch newData after adding list. 
    const fetchList = async () => {
      if (hasNewList) {
        try {
          await delay(200); 
          await getList();
        } finally {
          setHasNewList(false)
        }
      }
    }
    fetchList();
  }, [hasNewList])

  useEffect(() => { //this is for adding newList
    if (isCreateNewList) {
  
      const postList = async () => {
        const token = await getToken();
        const { apiUrl } = await config();
        const response = await axios.post(`${apiUrl}/trips/list`, {
          name: InputName,
        }, 
        {
          headers: {
            'authorization': `Bearer ${token}`
          }
        });
    
        console.log(response, 'adding new list')
      }
      postList();
      setIsCreateNewList(false);
      setInputName('');
      setHasNewList(true); 
    }

  }, [isCreateNewList]) 

  // const test = () => {
  //   console.log(allTravelList[1], 'allTravelList in trip Screen')
  // }


  return (
    <View>
      <ScrollView>
        {/* <Button title='test' onPress={test}/> */}
        <View style={[theme.topHeaderContainer, {zIndex: 100}]}>
          <CreateTravelListModal 
            setIsCreateNewList={setIsCreateNewList}
            setInputName={setInputName}
            InputName={InputName}
          />
          <CollapsibleDropdown
              setIsSharedList={setIsSharedList}
              allTravelList={allTravelList}
              selectedTrip={selectedTrip}
              setSelectedTrip={setSelectedTrip}
              handleSelect={handleSelect}
              sharedListWithUser={sharedListWithUser}
          />
        </View>
        <View>
          <Trips
            trip={selectedTrip}
            getList={getList}
            isSharedList={isSharedList}
          />
        </View>
        <View style={styles.mapContainer}>
          <MyMap selectedTrip={selectedTrip} />
        </View>
        {isRoomJoined &&
        <View style={styles.chatContainer}>
          <ChatModal
            setIsNewMessage={setIsNewMessage}
            setNewMessageCount={setNewMessageCount}
            newMessageCount={newMessageCount}
            listId={selectedTrip?.id}
            roomId={roomId}
            socket={socket}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            chat={chat}
            setChat={setChat}
          />
          {isNewMessage &&
          <View style={styles.messageIndicatorContainer}>
            <Text style={styles.messageIndicator}>{newMessageCount}</Text>
          </View>
          }
        </View>
        }
      </ScrollView>
    </View>
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
  messageIndicatorContainer: {
    minWidth: 20,        
    height: 20,
    backgroundColor: '#FF0000', 
    borderRadius: 10,       
    alignItems: 'center',   
    justifyContent: 'center',
    top: -7,                
    paddingHorizontal: 6,   
    zIndex: 1,              
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1.5,
  },
  messageIndicator: {
    color: '#FFFFFF',       
    fontSize: 12,
    fontWeight: 'bold',     
  },
  mapContainer: {
    height: 300, 
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  chatContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
});

export default TripsScreen;
