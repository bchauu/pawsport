import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import Trips from '../component/trips/Trips';
import MyMap from '../component/trips/Map';
import CreateTravelListModal from '../component/trips/CreateTravelListModal';
import ChatModal from '../component/trips/Chat/ChatModal';
import CollapsibleDropdown from '../component/trips/CollapsibleDropDown';
import {useTheme} from '../context/ThemeContext';
import {useSelectedTripListContext} from '../context/SelectedTripListContext';
import {useTravelList} from '../context/AllTravelListContext';
import {useSocketContext} from '../context/SocketContext';
import {useEmittedItems} from '../context/EmittedItemsContext';
import useApiConfig from '../utils/apiConfig';
import {useAuth} from '../context/AuthContext';
import axios from 'axios';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import LoginField from '../component/account/LoginField';
import {useAddedItem} from '../context/AddedItemContext';
import {useAllTrips} from '../context/AllTripsContext';

const TripsScreen = () => {
  const {theme} = useTheme();
  const {apiUrl, token} = useApiConfig();
  const {socket} = useSocketContext();
  const handleViewTravlers = () => {
    setIsTravelersViewed(prevState => !prevState);
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const [isTravelersViewed, setIsTravelersViewed] = useState(false);

  const {allTravelList, setAllTravelList} = useTravelList();
  const [isCreateNewList, setIsCreateNewList] = useState(false);
  const [InputName, setInputName] = useState(''); //lift state up from modal
  const [hasNewList, setHasNewList] = useState(false); // control rendering of list
  const {selectedTrip, setSelectedTrip} = useSelectedTripListContext();
  const [roomId, setRoomId] = useState('');
  const [isInitialList, setIsInitialList] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [chat, setChat] = useState([]);
  const [notes, setNotes] = useState([]);
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [sharedListWithUser, setSharedListWithUser] = useState([]);
  const [isSharedList, setIsSharedList] = useState(false);
  const [tripOrder, setTripOrder] = useState({});
  const {emittedItems, setEmittedItems} = useEmittedItems();
  const {isAuthenticated} = useAuth();
  const {isAddedItem, setIsAddedItem} = useAddedItem();
  const [isListReset, setIsListRest] = useState(false);
  const {allTrip, setAllTrip} = useAllTrips(); //this is why not refreshed

  const resetListState = () => {
    console.log('resetListState');
    // setSelectedTrip(null);
    // // setSubLevels({});
    setTripOrder({});
    // setAllTrip([]);

    // setAllTravelList([]);
    // delay(1000);
    setIsListRest(true);
    //might be close but probalby not all of them need to be
    //in fact, i should just remove all from usecallback and have a clean usecallback for this
  };

  useFocusEffect(
    useCallback(() => {
      if (isAddedItem) {
        console.log('Triggers multiple times because this runs for each item');
        setIsAddedItem(false);
        resetListState();
      }
    }, [isAddedItem]),
  );

  // const setAllListState = newTrip => {
  //   if (!newTrip) {
  //     return;
  //   }

  //   setSelectedTrip(newTrip);
  //   setSubLevels(extractSubLevels(newTrip.items)); // Extract sublevel data
  //   setTripOrder(initializeTripOrders(newTrip.items)); // Initialize trip order
  // };

  const getList = async () => {
    try {
      if (!token && !apiUrl) {
        return;
      }

      console.log(token, 'Token is valid, initiating request');

      const url = `${apiUrl}/trips/lists/places`;
      console.log(`Making request to URL: ${url}`);

      const response = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.travelLists) {
        console.log('Data retrieved successfully:', response.data.travelLists);

        setAllTravelList(prevList => {
          return [...response.data.travelLists.map(list => ({...list}))];
        });

        console.log('Travel list updated.');
      } else {
        console.warn('No travel lists found in the response.', response.data);
      }

      await delay(50);
      setIsInitialList(true);
      console.log('Initial list set successfully.');
    } catch (error) {
      console.error('Error occurred while fetching the list:', error);

      // Log additional details if available
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('General error:', error.message);
      }
    }
  };

  const handleSelect = trip => {
    setSelectedTrip(trip);
  };

  const test = () => {
    console.log(isAuthenticated, 'isAuthenticated');
    // console.log(allTravelList[0]?.items, 'testing notes before');
    // console.log(selectedTrip, 'selected trip in test');
    // console.log(tripOrder, 'tripOrder in test');
    // console.log(allTrip, 'alltrip in test');
  };

  const updateTravelList = () => {
    setAllTravelList(prevTravelLists =>
      prevTravelLists.map(list => {
        if (list.id === emittedItems[0].updatedList.travelListId) {
          // Handle emitted items and update `newItems`
          const newItems = emittedItems.reduce(
            (acc, {updatedList, action}) => {
              switch (action) {
                case 'addItem':
                  // Add new item only if it doesn't already exist
                  console.log(acc, 'acc in addItem');
                  console.log(updatedList, 'updatedList in addItem');
                  const exists = acc.some(item => item.id === updatedList.id);
                  return exists ? acc : [...acc, updatedList];

                case 'deleteItem':
                  // Remove the item by ID
                  return acc.filter(item => {
                    console.log(item, 'in deleteItem case'); //probably shiould be .updatedList.id
                    item.id !== updatedList.id;
                  });

                case 'modifyItem':
                  // Modify the item if it matches the ID
                  return acc.map(item =>
                    item.id === updatedList.id
                      ? {...item, ...updatedList}
                      : item,
                  );

                default:
                  console.warn('Unhandled action:', action);
                  return acc;
              }
            },
            [...list.items],
          ); // Start with the current items

          return {
            ...list,
            items: newItems, // Update the list's items
          };
        }
        return list; // Return unchanged lists
      }),
    );

    setEmittedItems([]);
  };

  const updateItemNotes = () => {
    setNotes(prevNotes => {
      return prevNotes.map(noteGroup => {
        // Check if the parentId matches
        if (noteGroup.parentId === emittedItems[0]?.updatedNotes.travelItemId) {
          let updatedNotes = [...noteGroup.notes]; // Copy current notes array

          emittedItems.forEach(({updatedNotes: newNote, action}) => {
            switch (action) {
              case 'addNote':
                // Add new note if it doesn't already exist
                const exists = updatedNotes.some(
                  note =>
                    note.id === newNote.id &&
                    note.category === newNote.category &&
                    note.message === newNote.notes &&
                    note.user === newNote.userId,
                );
                if (!exists) {
                  updatedNotes = [
                    ...updatedNotes,
                    {
                      id: newNote.id,
                      category: newNote.category,
                      message: newNote.notes,
                      user: newNote.userId,
                    },
                  ];
                }
                break;

              case 'deleteNote':
                // Remove the note by ID
                updatedNotes = updatedNotes.filter(
                  note => note.id !== newNote.id,
                );
                break;

              case 'modifyNote':
                // Update the note by ID
                updatedNotes = updatedNotes.map(note =>
                  note.id === newNote.id ? {...note, ...newNote} : note,
                );
                break;

              default:
                console.warn('Unhandled action:', action);
            }
          });

          // Return the updated note group
          return {
            ...noteGroup, // Preserve `parentId` and other properties
            notes: updatedNotes, // Update the `notes` array
          };
        }

        // Return unchanged note groups
        return noteGroup;
      });
    });

    // Clear emittedNotes after processing
    setEmittedItems([]);
  };

  useEffect(() => {
    const initialScreenVisit = async () => {
      await delay(1050);
      if (!token) {
        console.log('this should trigger after logged in, tripscreen');
      }
      if (token && apiUrl) {
        //initial
        getList();
        console.log('getlist in initialscreenvist');
        setIsListRest(false);
      }
    };
    initialScreenVisit();
  }, [token, apiUrl, isListReset]); //this is for very first time

  useEffect(() => {
    //emitting from tripscreen
    if (!socket) {
      return;
    }
    if (emittedItems.length > 0 && emittedItems[0]?.updatedList) {
      console.log(emittedItems, 'in tripscreen for emitted items');
      console.log(allTravelList, 'allTravelList tripscreen');

      updateTravelList();
    } else if (emittedItems.length > 0 && emittedItems[0]?.updatedNotes) {
      console.log(emittedItems, 'in tripscreen for emitted items');
      console.log(allTravelList, 'allTravelList tripscreen');
      console.log(
        emittedItems[0]?.updatedNotes,
        'new note from socket listener',
      );
      updateItemNotes();
    }
  }, [emittedItems, socket]);

  useEffect(() => {
    // if (!socket) {
    //   return;
    // }

    socket.on('updateListItems', (updatedList, eventAction) => {
      console.log('Updated list received:', updatedList);

      setEmittedItems(prev => [...prev, {updatedList, action: eventAction}]); // Update emitted items
    });

    socket.on('updateNotes', (updatedNotes, eventAction) => {
      console.log('Updated list received:', updatedNotes, eventAction);

      setEmittedItems(prev => [...prev, {updatedNotes, action: eventAction}]);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('updateNotes');
      socket.off('updateListItems');
    };
  }, [socket]);

  useEffect(() => {
    if (token && apiUrl) {
      console.log('gets shared list');
      const getSharedList = async () => {
        const response = await axios.get(`${apiUrl}/trips/lists/shared`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log(response, 'getsharedList');

        setSharedListWithUser(response.data.listPermission);
      };

      getSharedList();
      setIsListRest(false);
    }
    // const getSharedList = async () => {
    //   const response = await axios.get(`${apiUrl}/trips/lists/shared`, {
    //     headers: {
    //       authorization: `Bearer ${token}`,
    //     },
    //   });

    //   setSharedListWithUser(response.data.listPermission);
    // };

    // getSharedList();
  }, [token, apiUrl, isListReset]); //query shared list with current user
  // }, [token, apiUrl]); //query shared list with current user

  useEffect(() => {
    setNewMessageCount(4 + 1); // for testing

    if (chat.length > 0) {
      setIsNewMessage(true);
    }
  }, [chat]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('message', data => {
      console.log('Received message:', data);
    });

    return () => {
      socket.off('message');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    if (socket && selectedTrip) {
      console.log('leaving room useEffect triggered', `${roomId} this room`);

      socket.emit('joinRoom', {listId: selectedTrip.id}, response => {
        if (response.status === 'success') {
          setRoomId(response.roomId); // Update to new room ID
          console.log(`Joined room: ${response.roomId} in tripScreen`);
          setIsRoomJoined(true);
        } else {
          console.error(response.reason);
        }
      });
    }
  }, [selectedTrip, socket]);

  useEffect(() => {
    if (!selectedTrip) {
      console.log(allTravelList, 'set selected trip should be chosn here');
      setSelectedTrip(allTravelList[0]);
      setIsListRest(false);
    }
  }, [isInitialList, allTravelList]); //auto pick first (2nd) one on load
  // }, [isInitialList]); //auto pick first (2nd) one on load

  useEffect(() => {
    //this is to fetch newData after adding list.
    if (token && apiUrl) {
      const fetchList = async () => {
        if (hasNewList && token) {
          try {
            await delay(200);
            await getList();
          } finally {
            console.log('editOnFirstNote changed back to false');
            setHasNewList(false);
          }
        }
      };
      fetchList();
    }
  }, [hasNewList]);

  useEffect(() => {
    //this is for adding newList
    if (isCreateNewList) {
      const postList = async () => {
        const response = await axios.post(
          `${apiUrl}/trips/list`,
          {
            name: InputName,
          },
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
      };
      postList();
      setIsCreateNewList(false);
      setInputName('');
      setHasNewList(true);
    }
  }, [isCreateNewList]);

  return (
    <View>
      <TouchableOpacity onPress={test}>
        <Text>Test</Text>
      </TouchableOpacity>
      {!token && (
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <LoginField />
          </View>
        </View>
      )}
      <ScrollView>
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
            setTrip={setSelectedTrip}
            getList={getList}
            isSharedList={isSharedList}
            tripOrder={tripOrder}
            setTripOrder={setTripOrder}
            isRoomJoined={isRoomJoined}
            notes={notes}
            setNotes={setNotes}
          />
        </View>
        <View style={styles.mapContainer}>
          <MyMap
            selectedTrip={selectedTrip}
            tripOrder={tripOrder}
            setTripOrder={setTripOrder}
          />
        </View>
        {isRoomJoined && (
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
            {isNewMessage && (
              <View style={styles.messageIndicatorContainer}>
                <Text style={styles.messageIndicator}>{newMessageCount}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', // Ensure it covers the whole screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Make sure it's on top
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // Ensure content is centered inside modal
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
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
    shadowOffset: {width: 0, height: 1},
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
    justifyContent: 'center',
  },
});

export default TripsScreen;
