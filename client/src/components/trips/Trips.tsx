import React, {useState, useEffect} from "react";
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import axios from 'axios';
import useApiConfig from "../../utils/apiConfig";
import Share from "./Share";
import CollaboratorsModal from "./CollaboratorsModal";
import ManualSwipeableRow from "./gesture/ManualSwipeableItem";

const Trips = ({trip, getList}) => {
  const [hasUpdatedSharedUser, setHasUpdatedSharedUser] = useState(false);
  const [allTrip, setAllTrip] = useState([]);   // this needs to change with 
  const [deletedTrip, setDeletedTrip] = useState('');
  const [deletedTripIndex, setDeletedTripIndex] = useState(-1); //keeping in state incase i want to implement undo button

  useEffect(() => {
      if (trip) {
        setAllTrip([...trip?.items])
      }
      getList();  //ensures list is latest from database --> list wont be old from switching lists

  }, [trip])  // now the list of trips is stored in its own state which renders based on this state

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
      setDeletedTrip(deletedTrip[0]); //temp hold whats deleted
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

  const renderPlaces = ({ item, index }) => {
      return (
        <View style={styles.itemContainer}>
          <ManualSwipeableRow
            item={item} 
            index={index+1}
            handleDeleteItem={handleDeleteItem}
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
      flexDirection: 'row',  // Align number and text horizontally
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
