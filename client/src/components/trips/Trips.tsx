import React, {useState, useEffect} from "react";
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import axios from 'axios';
import useApiConfig from "../../utils/apiConfig";
import Share from "./Share";
import CollaboratorsModal from "./CollaboratorsModal";
import ManualSwipeableRow from "./gesture/ManualSwipeableItem";
import NotesSection from "./notes/NotesSection";
import NoteInput from './notes/NoteInput';

const Trips = ({trip, getList}) => {
  const [hasUpdatedSharedUser, setHasUpdatedSharedUser] = useState(false);
  const [allTrip, setAllTrip] = useState([]);   // this needs to change with 
  const [deletedTrip, setDeletedTrip] = useState('');
  const [notes, setNotes] = useState([]);
  const [tripsEnteredNotes, setTripsEnteredNotes] = useState('');
  const [selectedNoteTrip, setSelectedNoteTrip] = useState('');
  const [newNoteAdded, setNewNoteAdded] = useState(false);
  const [deletedTripIndex, setDeletedTripIndex] = useState(-1); 
  const [isItemNotesCollapsed, setItemIsNotesCollapsed] = useState({});

  useEffect(() => {
      if (trip) {
        setAllTrip([...trip?.items])
        // console.log(allTrip, 'allTrip')
      }
      getList();  //ensures list is latest from database --> list wont be old from switching list

  }, [trip])  // now the list of trips is stored in its own state which renders based on this state


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

        console.log(response.data.travelList[0].notes, 'response for notes')

          const arrangedNotes = response.data.travelList.map((travelItem) => (
            {
              parentId: travelItem.id,
              notes: travelItem.notes.map(note => note.notes)    //this is extra
            }
          ))
          console.log(arrangedNotes, 'arrangedNotes')

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
          handleEnteredNotes={handleEnteredNotes}
          newNoteAdded={newNoteAdded}
          addNotes={addNotes}
        />

        </View>
        
      );
  };

    return (
        <View>
            <TouchableOpacity 
                // onPress={() => onSelect(trip)}
                style={[
                  styles.item, 
                  // isSelected && styles.selectedItem
                ]}
            >
                <Text>{trip?.name}</Text>
                <Share handleShare={handleShare}></Share>
                <TouchableOpacity>
                  <Text>View Collaborators</Text>
                  <CollaboratorsModal
                    trip={trip}
                    hasUpdatedSharedUser={hasUpdatedSharedUser}
                    setHasUpdatedSharedUser={setHasUpdatedSharedUser}
                  />
                </TouchableOpacity>
            </TouchableOpacity>
                <FlatList
                    data={allTrip}
                    renderItem={renderPlaces}
                    keyExtractor={(item)=> item.id }
                    contentContainerStyle={styles.listContainer}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    listContainer: {
      padding: 20,
    },
    itemContainer: {
      flexDirection: 'column',  // Align number and text horizontally
      marginBottom: 5,
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
  });

export default Trips;
