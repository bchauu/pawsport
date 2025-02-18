import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import useApiConfig from '../../utils/apiConfig';
import Share from './Share';
import TravelBuddiesButton from './TravelBuddiesButton';
import ManualSwipeableRow from './gesture/ManualSwipeableItem';
import NotesSection from './notes/NotesSection';
import NoteInput from './notes/NoteInput';
import SubLevelInput from './subLevels/SubLevelInput';
import RemoveSubLevel from './subLevels/RemoveSubLevel';
import {useAllTrips} from '../../context/AllTripsContext';
import {useTheme} from '../../context/ThemeContext';
import {useEmittedItems} from '../../context/EmittedItemsContext';

// import {useTravelList} from '../context/AllTravelListContext';

const Trips = ({
  trip,
  getList,
  isSharedList,
  setTrip,
  tripOrder,
  setTripOrder,
  isRoomJoined,
  notes,
  setNotes,
}) => {
  const {theme} = useTheme();
  const [hasUpdatedSharedUser, setHasUpdatedSharedUser] = useState(false);
  const {allTrip, setAllTrip} = useAllTrips(); //this is why not refreshed
  const {emittedItems, setEmittedItems} = useEmittedItems();
  const [deletedTrip, setDeletedTrip] = useState('');
  const [tripsEnteredNotes, setTripsEnteredNotes] = useState('');
  const [selectedNoteTrip, setSelectedNoteTrip] = useState('');
  const [newNoteAdded, setNewNoteAdded] = useState(false);
  const [deletedTripIndex, setDeletedTripIndex] = useState(-1);
  const [isItemNotesCollapsed, setItemIsNotesCollapsed] = useState({});
  const [isTravelersViewed, setIsTravelersViewed] = useState(false);
  const [subLevels, setSubLevels] = useState([]);
  const [inputCategory, setInputCategory] = useState({});
  const [highestValueSubLevel, setHighestValueSubLevel] = useState({});
  const [listActions, setListActions] = useState({
    viewBuddies: false,
    invite: false,
    addLevel: false,
  });
  const [reviws, setReviews] = useState([]);
  const {apiUrl, token} = useApiConfig();

  useEffect(() => {
    console.log(trip, 'trip in trips.tsx');
    if (apiUrl && token) {
      if (trip) {
        setAllTrip(trip?.items.map(item => ({...item})));
        console.log('setting allTrips with first edit');

        const initialOrder = {};
        trip.items.forEach(item => {
          initialOrder[item.id] = {
            value: item.order,
            subLevel: item.subLevelName,
          }; // Assign key-value pairs directly to the object
        });

        setTripOrder(initialOrder);

        setSubLevels(trip?.subLevels.map(subLevel => ({...subLevel})));
      }
      // getList(); //ensures list is latest from database --> list wont be old from switching list
    }
  }, [trip, apiUrl, token]); // now the list of trips is stored in its own state which renders based on this state

  useEffect(() => {
    allTrip.map(item =>
      setItemIsNotesCollapsed(prevState => ({
        ...prevState,
        [item.id]: {isCollapsed: false},
      })),
    );
  }, [allTrip, token]);

  useEffect(() => {
    //individual notes fro each place
    if (trip) {
      const getNotes = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/trips/list/places/allnotes`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
              params: {
                travelListId: trip.id,
              },
            },
          );

          const arrangedNotes = response.data.travelList.map(travelItem => ({
            parentId: travelItem.id,
            notes: travelItem.notes.map(
              note => {
                return {
                  category: note.category,
                  message: note.notes,
                  user: note.user.username,
                };
              },
              // {
              //   note.notes

              // }
            ), //this is extra
            // user: travelItem.user
          }));
          console.log('successfully fetched notes');
          setNotes(arrangedNotes);
          setNewNoteAdded(false);
        } catch (error) {
          console.log(error, 'error in getNotes');
        }
      };

      getNotes();
    }
  }, [trip, newNoteAdded, emittedItems, isRoomJoined]);

  const changeItemCategory = item => {
    //leaving here for now. should work if i add shiftupOrder. going with delete all if confirm
    // console.log(tripOrder, 'sublevel')
    // const subLevelName = item.name,
    //       subLevelId = item.id;
    //       // tripToUpdate = [];
    // allTrip.forEach((item, index) => { //changing to null
    //   if (item.subLevelName === subLevelName) {
    //         console.log(tripOrder[item.id], 'here')
    //         console.log({[index]: item},  'the item in allTrip')
    //         item.subLevelName = null;   //bypassing reacts state re-render
    //         // tripToUpdate.push({[index]: item})
    //         const newNull = { // this is fine
    //           [item.id.toString()]: {
    //             subLevel: null,
    //             value: 10   //need to find right value is last thing. need to find last value of null list
    //           }
    //         }
    //         setTripOrder((prev) => (    //issue is not order but alltrips since thats used to filter. since split by category. need to fetch again most likely
    //           {
    //             ...prev,
    //             ... newNull
    //           }
    //         ))
    //   }
    // })
    // setAllTrip(allTrip)
  };

  const handleShare = async input => {
    try {
      const response = await axios.post(
        `${apiUrl}/permissions/grant`,
        {
          travelListId: trip.id,
          sharedEmail: `${input}`,
          sharedUserName: '', //should be one field. adjust backend to only use one field and check for both user and email
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      setHasUpdatedSharedUser(true);
    } catch (error) {
      if (error.response.status === 409) {
        console.log(error.response.status, error.response.data.message);
      }
    }
  };

  const handleDeleteItem = async ({id, travelListId, placeId}) => {
    console.log(id, travelListId, placeId, 'in handleDelete');

    //optimistic deletion
    const withoutDeletedItemTrip = allTrip.filter(item => item.id !== id);
    const deletedTripItem = allTrip.filter(item => item.id === id); //save to state
    setDeletedTrip(deletedTripItem[0]); //temp hold whats deleted
    const index = allTrip.indexOf(deletedTripItem[0]); //holding the index of whats deleted
    setDeletedTripIndex(index);
    setAllTrip([...withoutDeletedItemTrip]); // this set removes from state and updates
    const deletedTripId = deletedTripItem[0].id;
    const shiftUpTripOrder = {};

    for (const id in tripOrder) {
      if (
        tripOrder[id].value > tripOrder[deletedTripId].value &&
        tripOrder[id].subLevel == deletedTripItem[0].subLevelName
      ) {
        shiftUpTripOrder[id] = {
          subLevel: tripOrder[id].subLevel,
          value: tripOrder[id].value - 1,
        };
      }
    }
    setTripOrder(prev => ({...prev, ...shiftUpTripOrder}));

    setTrip(prevTrip => {
      return {
        ...prevTrip, // Copy the rest of the trip object
        items: prevTrip.items.filter(item => item.id !== deletedTripId), // Remove the item with the specified ID
      };
    });

    try {
      const response = await axios.delete(
        `${apiUrl}/trips/lists/places/delete`,
        {
          data: {
            travelListId: travelListId,
            placeId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data, 'successfully deleted item from list');
    } catch (error) {
      console.log(error.message, 'error in deleting item from list');
      //delete unsuccessful   --> setting it back
      withoutDeletedItemTrip.splice(deletedTripIndex, 0, deletedTripItem[0]);
      setAllTrip([...withoutDeletedItemTrip]);
      Alert.alert('Error in deleting, please try again later');
    }
  };

  const handleViewTravlers = () => {
    setIsTravelersViewed(prevState => !prevState);
  };

  const queryUpdateOrderUp = async payload => {
    //setup backend to update list order
    try {
      const response = await axios.post(
        `${apiUrl}/trips/lists/places/moveup`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data.message, 'response');
      return 'Update succeeded';
    } catch (error) {
      console.log(error, 'error');
      return 'fail swap';
    }
  };

  const handleTripOrderChange = (tripOrder, item) => {
    const currentOrder = tripOrder[item.id].value, //here also using value
      currentSubLevel = tripOrder[item.id].subLevel || null,
      currentTrip = item.id;
    let switchedSubLevel = null,
      orderToSwitch = (tripOrder[item.id].value - 1).toString(), //this should be number cuz minusing   --> using value
      tripToSwap,
      found = false;

    for (const id in tripOrder) {
      if (
        tripOrder[id].value == orderToSwitch &&
        tripOrder[id].subLevel == currentSubLevel.toString()
      ) {
        //because there is no zero in order. this is highest
        found = true;
        tripToSwap = id;

        if (tripOrder[tripToSwap].subLevel === null) {
          switchedSubLevel = null;
        } else {
          switchedSubLevel = tripOrder[tripToSwap].subLevel; //becomes day 1 if first clicked
        }
      } else {
        console.log('not found', `for this id: ${id}`);
      }
    }

    if (!found) {
      console.log('sublevels dont match');
      return;
    }

    if (switchedSubLevel == currentSubLevel) {
      // still undefined but works cuz not deeply equal
      let swapped = {
        //sublevels dont switch. only value
        [tripToSwap?.toString()]: {
          value: currentOrder,
          subLevel: switchedSubLevel,
        },
        [currentTrip.toString()]: {
          value: orderToSwitch,
          subLevel: currentSubLevel,
        },
      };

      setTripOrder(prev => ({
        ...prev,
        ...swapped,
      }));

      const handleOrderUpdate = async () => {
        try {
          const result = await queryUpdateOrderUp({
            currentTrip: {id: currentTrip, value: orderToSwitch},
            tripToSwap: {id: tripToSwap, value: currentOrder},
          });

          // Conditional check on the result
          if (result === 'Update succeeded') {
            console.log('Update succeeded:');
          } else if (result === 'fail swap') {
            console.error('moving up failed');

            let swapBack = {
              //sublevels dont switch. only value
              [tripToSwap?.toString()]: {
                value: orderToSwitch,
                subLevel: switchedSubLevel,
              },
              [currentTrip.toString()]: {
                value: currentOrder,
                subLevel: currentSubLevel,
              },
            };

            setTripOrder(prev => ({
              ...prev,
              ...swapBack,
            }));
            //revert client swap
          }
        } catch (error) {
          console.error('Error occurred:', error.message || error);
        }
      };
      if (found) {
        handleOrderUpdate();
      }
    } else {
      console.log("can't swawp due to different sublevels");
    }
  };

  const handleCategoryChange = (selectedCategory, id) => {
    setInputCategory(prev => ({
      ...prev,
      [id]: selectedCategory,
    }));
  };

  const addNotes = async ({id, placeId}) => {
    const selectedCategory = inputCategory[id]; //will have issues here

    try {
      const response = await axios.post(
        `${apiUrl}/trips/lists/places/note`,
        {
          travelListId: selectedNoteTrip.travelListId, //these two need to be taken from item
          itemId: selectedNoteTrip.id,
          placeId,
          note: tripsEnteredNotes,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTripsEnteredNotes('');
      setNewNoteAdded(true);
    } catch (error) {
      console.log(error.message, 'error in adding notes to list');
    }
  };

  const handleEnteredNotes = (value, item) => {
    setTripsEnteredNotes(value);
    setSelectedNoteTrip(item);
  };

  const renderPlaces = ({item, index}) => {
    return (
      <View style={styles.itemContainer}>
        <ManualSwipeableRow
          item={item}
          index={index + 1}
          handleDeleteItem={handleDeleteItem}
          setItemIsNotesCollapsed={setItemIsNotesCollapsed}
          handleTripOrderChange={handleTripOrderChange}
          tripOrder={tripOrder}
          setTripOrder={setTripOrder}
          allTrip={allTrip}
          highestValueSubLevel={highestValueSubLevel}
          setHighestValueSubLevel={setHighestValueSubLevel}
          subLevels={subLevels}
        />
        <NotesSection
          isItemNotesCollapsed={isItemNotesCollapsed}
          handleCategoryChange={handleCategoryChange}
          notes={notes}
          item={item}
        />
        <NoteInput
          item={item}
          index={index + 1}
          isItemNotesCollapsed={isItemNotesCollapsed}
          handleEnteredNotes={handleEnteredNotes}
          newNoteAdded={newNoteAdded}
          addNotes={addNotes}
        />
      </View>
    );
  };

  const handleActionButton = action => {
    setListActions(prev => ({
      viewBuddies: action === 'viewBuddies' ? !prev.viewBuddies : false,
      invite: action === 'invite' ? !prev.invite : false,
      addLevel: action === 'addLevel' ? !prev.addLevel : false,
    }));
  };

  return (
    <View>
      <View>
        <View style={theme.lists.mainHeaderContainer}>
          <Text style={theme.lists.mainHeader}>{trip?.name}</Text>
          <View style={theme.lists.mainHeaderButtons}>
            <TouchableOpacity
              onPress={() => handleActionButton('invite')}
              style={[theme.buttons.action]}>
              <Text style={[theme.buttons.actionText]}>Invite</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleActionButton('viewBuddies')}
              style={[theme.buttons.action]}>
              <Text style={[theme.buttons.actionText]}>Travel Buddies</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleActionButton('addLevel')}
              style={[theme.buttons.action]}>
              <Text style={[theme.buttons.actionText]}>
                Add Intinerary Block
              </Text>
            </TouchableOpacity>
          </View>
          <View style={theme.lists.mainHeaederDetails}>
            {!isSharedList && listActions.invite ? (
              <Share handleShare={handleShare} />
            ) : listActions.viewBuddies ? (
              <TravelBuddiesButton
                trip={trip}
                hasUpdatedSharedUser={hasUpdatedSharedUser}
                setHasUpdatedSharedUser={setHasUpdatedSharedUser}
                isSharedList={isSharedList}
                isTravelersViewed={isTravelersViewed}
                apiUrl={apiUrl}
                token={token}
              />
            ) : (
              listActions.addLevel && <SubLevelInput trip={trip} />
            )}
          </View>
        </View>
      </View>
      <View style={theme.personalList.mainContainer}>
        {subLevels.length > 0 &&
          subLevels
            .sort((a, b) => a.id - b.id)
            .map((subLevel, index) => (
              <View key={index} style={theme.personalList.list}>
                <View style={theme.personalList.subListHeaderContainer}>
                  <Text style={theme.personalList.subListHeaderText}>
                    {subLevel.name}
                  </Text>
                  <RemoveSubLevel
                    changeItemCategory={changeItemCategory}
                    subLevel={subLevel}
                    setSubLevels={setSubLevels}
                  />
                </View>
                <View>
                  <FlatList
                    data={allTrip
                      ?.filter(trip => subLevel.name === trip.subLevelName) //if its in all trip, it means its missing from trip order
                      ?.sort(
                        (a, b) =>
                          tripOrder[a.id]?.value - tripOrder[b.id]?.value,
                      )}
                    renderItem={renderPlaces}
                    keyExtractor={item => item.id}
                    contentContainerStyle={theme.personalList.subList}
                    scrollEnabled={false}
                  />
                </View>
              </View>
            ))}
        <View style={theme.personalList.list}>
          <FlatList
            data={allTrip
              ?.filter(trip => trip.subLevelName === 'default')
              ?.sort((a, b) => tripOrder[a.id]?.value - tripOrder[b.id]?.value)}
            renderItem={renderPlaces}
            keyExtractor={item => item.id}
            contentContainerStyle={theme.personalList.subList}
            scrollEnabled={false}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'column', // Align number and text horizontally
    marginBottom: 5,
    // padding: 50
  },
  item: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#e0e0e0', // Default background color
    borderRadius: 5,
  },
  selectedItem: {
    backgroundColor: '#a0a0a0', // Background color for selected item
  },
  number: {
    marginRight: 10, // Space between number and text
    fontSize: 16,
    fontWeight: 'bold', // Make the number bold
  },
  itemText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  subLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Trips;
