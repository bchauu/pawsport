import React, {useState, useEffect} from "react";
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import axios from 'axios';
import useApiConfig from "../../utils/apiConfig";
import Share from "./Share";
import TravelBuddiesButton from "./TravelBuddiesButton";
import ManualSwipeableRow from "./gesture/ManualSwipeableItem";
import NotesSection from "./notes/NotesSection";
import NoteInput from './notes/NoteInput';
import SubLevelInput from "./subLevels/SubLevelInput";
import RemoveSubLevel from "./subLevels/RemoveSubLevel";
import { useTheme } from "../../context/ThemeContext";

const Trips = ({trip, getList, isSharedList}) => {
  const { theme } = useTheme();
  const [hasUpdatedSharedUser, setHasUpdatedSharedUser] = useState(false);
  const [allTrip, setAllTrip] = useState([]);   // this needs to change with 
  const [deletedTrip, setDeletedTrip] = useState('');
  const [notes, setNotes] = useState([]);
  const [tripsEnteredNotes, setTripsEnteredNotes] = useState('');
  const [selectedNoteTrip, setSelectedNoteTrip] = useState('');
  const [newNoteAdded, setNewNoteAdded] = useState(false);
  const [deletedTripIndex, setDeletedTripIndex] = useState(-1); 
  const [isItemNotesCollapsed, setItemIsNotesCollapsed] = useState({});
  const [isTravelersViewed, setIsTravelersViewed] = useState(false);
  const [subLevels, setSubLevels] = useState([]);
  const [listActions, setListActions] = useState({
    viewBuddies: false,
    invite: false,
    addLevel: false
  })

  // console.log(trip, 'checking trip')

  //need to have socket open to refresh when new notes are added
    //but also if new items in list are listed as well?


  //if selecting 'shared with you'
    //share button should not be displayed

    //japan travels
        //null
      //or
        //Id 1  --> array 
          // Day 1
          // Day 2
          // Day 3
      
      //japan hotel
        // Day 1

      //just matching string name with levels available on array of list



  useEffect(() => {
      if (trip) {
        setAllTrip([...trip?.items])
        setSubLevels([...trip?.subLevels])
      }
      getList();  //ensures list is latest from database --> list wont be old from switching list

  }, [trip]) // now the list of trips is stored in its own state which renders based on this state


  useEffect(() => {
    allTrip.map((item) => (
      setItemIsNotesCollapsed((prevState) => ({
        ...prevState,
        [item.id]: {isCollapsed: false}
      }))
    ))

  }, [allTrip])

  useEffect(() => { //individual notes fro each place
    if (trip) {
     
      const getNotes = async () => {
        console.log(trip.id, 'hitting getNotes')
        try {
          const response = await axios.get(`${apiUrl}/trips/list/places/allnotes`, {
            headers: {
              'authorization': `Bearer ${token}`
            },
            params: {
              travelListId: trip.id,
            }
        });

        console.log(response.data.travelList[0].notes[0].user.username, 'response for notes')
          //this works. i have each username and id.
              //store inside state of notes so can be displayed alongside each note

          const arrangedNotes = response.data.travelList.map((travelItem) => (
            {
              parentId: travelItem.id,
              notes: travelItem.notes.map(note => {
                return {
                  message: note.notes,
                  user: note.user.username
                }
              }
                // {
                //   note.notes

                // }

              ),    //this is extra
              // user: travelItem.user
            }
          ))
          console.log(arrangedNotes[0].notes, 'arrangedNotes')

          setNotes(arrangedNotes);
          setNewNoteAdded(false);
        } catch (error) {
          console.log(error, 'error in getNotes')
        }
  
      };

   

      getNotes();
    }
  }, [trip, newNoteAdded])

  const {token, apiUrl} = useApiConfig();

  const handleShare = async (input) => {

    try {
      const response = await axios.post(`${apiUrl}/permissions/grant`, {
          travelListId: trip.id, 
          sharedEmail: `${input}`,
             sharedUserName: '' //should be one field. adjust backend to only use one field and check for both user and email
        },
        {
          headers: {
            'authorization': `Bearer ${token}`
          }
        }
      )
      setHasUpdatedSharedUser(true);
    } catch (error) {
        if (error.response.status === 409) {

          console.log(error.response.status, error.response.data.message);
        }
    }
  }

  const handleDeleteItem = async ({id, travelListId}) => {

    //optimistic deletion
      const withoutDeletedItemTrip = allTrip.filter((item) => item.id !== id) 
      const deletedTripItem = allTrip.filter((item) => item.id === id); //save to state
      setDeletedTrip(deletedTripItem[0]); //temp hold whats deleted
      const index = allTrip.indexOf(deletedTripItem[0]) //holding the index of whats deleted
      setDeletedTripIndex(index)
      setAllTrip([...withoutDeletedItemTrip]) // this set removes from state and updates

    try {
      const response = await axios.delete(`${apiUrl}/trips/lists/places/delete`, {
        data: {
          travelListId: travelListId,
          itemId: id
        }
      ,
        headers: {
          'Authorization': `Bearer ${token}`
        }
    })
      console.log(response.data, 'successfully deleted item from list')

    } catch (error) {
      console.log(error.message, 'error in deleting item from list')
      //delete unsuccessful   --> setting it back 
      withoutDeletedItemTrip.splice(deletedTripIndex, 0, deletedTripItem[0])
      setAllTrip([...withoutDeletedItemTrip])
      Alert.alert("Error in deleting, please try again later")
    }
  }

  const handleViewTravlers = () => {
    setIsTravelersViewed((prevState) => !prevState)
  }


  const addNotes = async () => {

    console.log(tripsEnteredNotes, 'TripsenteredNotes')

    console.log(selectedNoteTrip, 'selected item for note')

    
    try {
      const response = await axios.post(
        `${apiUrl}/trips/lists/places/note`, 
        {
            travelListId: selectedNoteTrip.travelListId,  //these two need to be taken from item
            itemId: selectedNoteTrip.id,
            note: tripsEnteredNotes
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
    )
      console.log(response.data.message, 'successfully added notes to item from list')
      setTripsEnteredNotes('');
      setNewNoteAdded(true);

    } catch (error) {
      console.log(error.message, 'error in adding notes to list')
    }
  }

  const handleEnteredNotes = (value, item) => {
      setTripsEnteredNotes(value);
      setSelectedNoteTrip(item);
  }

  const renderPlaces = ({ item, index }) => {
    // console.log(item, 'what is item')
    // console.log(subLevels, 'subLevels in renderPlaces')
  
      return (
        <View style={styles.itemContainer}>
          <ManualSwipeableRow
            item={item} 
            index={index+1}
            handleDeleteItem={handleDeleteItem}
            setItemIsNotesCollapsed={setItemIsNotesCollapsed}
          />
          <NotesSection 
            isItemNotesCollapsed={isItemNotesCollapsed}
            notes={notes}
            item={item}
          />
          <NoteInput
            item={item}
            index={index+1}
            isItemNotesCollapsed={isItemNotesCollapsed}
            handleEnteredNotes={handleEnteredNotes}
            newNoteAdded={newNoteAdded}
            addNotes={addNotes}
          />

        </View>
        
      );
  };

  const handleActionButton = (action) => {
    setListActions((prev) => ({
      viewBuddies: action === "viewBuddies" ? !prev.viewBuddies : false,
      invite: action === "invite" ? !prev.invite : false,
      addLevel: action === "addLevel" ? !prev.addLevel : false,
    }));
  
    console.log(action, 'action triggered');
    console.log(listActions,'listActions')
  };

  //isSharedList --> conditionally render if shared is true or false. to allow rendering of guest of admin look
    return (
        <View>
          <View>
            <View style={theme.list.mainHeaderContainer}>
              <Text style={theme.list.mainHeader}>{trip?.name}</Text>
              <View style={theme.list.mainHeaederButtons}>
                <TouchableOpacity 
                onPress={() => handleActionButton('invite')}
                style={[theme.actionButton.default]}
                >
                  <Text style={[theme.actionButton.text]}>Invite</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleActionButton('viewBuddies')}
                  style={[theme.actionButton.default]}
                  >
                  <Text style={[theme.actionButton.text]}>Travel Buddies</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleActionButton('addLevel')}
                  style={[theme.actionButton.default]}
                  >
                  <Text style={[theme.actionButton.text]}>Add Intinerary Block</Text>
                </TouchableOpacity>
              </View>
              <View style={theme.list.mainHeaederDetails}>
              {!isSharedList && listActions.invite ?
                <Share handleShare={handleShare}></Share>
              :
              listActions.viewBuddies ?
                <TravelBuddiesButton
                  trip={trip}
                  hasUpdatedSharedUser={hasUpdatedSharedUser}
                  setHasUpdatedSharedUser={setHasUpdatedSharedUser}
                  isSharedList={isSharedList}
                  isTravelersViewed={isTravelersViewed}
                  apiUrl={apiUrl}
                  token={token}
                />
              : listActions.addLevel &&
                <SubLevelInput trip={trip}/>
              }
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
                        subLevel={subLevel}
                        setSubLevels={setSubLevels}
                        />
                    </View>
                    <View>
                      <FlatList 
                        data={allTrip.filter((trip) => subLevel.name === trip.subLevelName)}
                        renderItem={renderPlaces}
                        keyExtractor={(item)=> item.id }
                        contentContainerStyle={theme.personalList.subList}
                        scrollEnabled={false} 
                      />
                    </View>
                  </View>
                ))
              }
              <View style={theme.personalList.list}>
                <FlatList
                  data={allTrip.filter((trip) => trip.subLevelName === null)}
                  renderItem={renderPlaces}
                  keyExtractor={(item)=> item.id }
                  contentContainerStyle={theme.personalList.subList}
                  scrollEnabled={false} 
                />
              </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'column',  // Align number and text horizontally
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
      marginRight: 10,       // Space between number and text
      fontSize: 16,
      fontWeight: 'bold',    // Make the number bold
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
      }
  });

export default Trips;
