import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Trips from '../component/trips/Trips';
import MyMap from '../component/trips/Map';
import CreateTravelListModal from '../component/trips/CreateTravelListModal';
import ChatModal from '../component/trips/Chat/ChatModal';
// import {useNavigation} from '@react-navigation/native';
import CollapsibleDropdown from '../component/trips/CollapsibleDropDown';
import {useTheme} from '../context/ThemeContext';
import {useApiConfigContext} from '../context/ApiConfigContext';
import {useSelectedTripListContext} from '../context/SelectedTripListContext';
import {useTravelList} from '../context/AllTravelListContext';
import {useSocketContext} from '../context/SocketContext';
import {useEmittedItems} from '../context/EmittedItemsContext';
import axios from 'axios';

const TripsScreen = () => {
  // const navigation = useNavigation();
  const {theme} = useTheme();
  const {apiUrl, token} = useApiConfigContext();
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

  const getList = async () => {
    const response = await axios.get(`${apiUrl}/trips/lists/places`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    setAllTravelList(prevList => {
      return [...response.data.travelLists.map(list => ({...list}))];
    });
    await delay(50);
    setIsInitialList(true);
  };

  const handleSelect = trip => {
    setSelectedTrip(trip);
  };

  const test = () => {
    console.log(allTravelList[0]?.items, 'testing notes before');
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
    if (token) {
      //initial
      getList();
    }
  }, [token]); //this is for very first time

  useEffect(() => {
    //emitting from tripscreen
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
  }, [emittedItems]);

  useEffect(() => {
    if (!socket) {
      return;
    }

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
    const getSharedList = async () => {
      const response = await axios.get(`${apiUrl}/trips/lists/shared`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setSharedListWithUser(response.data.listPermission);
    };

    getSharedList();
  }, []); //query shared list with current user

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
  }, [selectedTrip]);

  useEffect(() => {
    if (!selectedTrip) {
      setSelectedTrip(allTravelList[0]);
    }
  }, [isInitialList]); //auto pick first (2nd) one on load

  useEffect(() => {
    //this is to fetch newData after adding list.
    const fetchList = async () => {
      if (hasNewList) {
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
      {/* <TouchableOpacity onPress={test}>
        <Text>Test</Text>
      </TouchableOpacity> */}
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
