import React, {useState, useEffect} from "react";
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import axios from 'axios';
import useApiConfig from "../../utils/apiConfig";
import Share from "./Share";
import CollaboratorsModal from "./CollaboratorsModal";
import ManualSwipeableRow from "./gesture/ManualSwipeableItem";

const Trips = ({trip, getList}) => {
  const [hasUpdatedSharedUser, setHasUpdatedSharedUser] = useState(false);
  const [allTrip, setAllTrip] = useState([]);   // this needs to change with 

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

    console.log(id, travelListId, 'works from child')
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
      const withoutDeletedItemTrip = allTrip.filter((item) => item.id !== id)
      setAllTrip([...withoutDeletedItemTrip]) // this set removes from state and updates

    } catch (error) {
      console.log(error.message, 'error in deleting item from list')
    }
  }
  // 1.	Immediate State Update: Remove the item from the UI instantly to enhance responsiveness.
	// 2.	Temporary Storage: Save a reference to the deleted item in case you need to restore it later.
	// 3.	Server Response Handling:
	// •	If Successful: Clear the temporary storage, confirming the deletion.
	// •	If Failed: Re-add the item to the UI and notify the user of the deletion failure.

    //in addition for user friendly
        // after adding items to list or deleting
          // we need to display a notice its either deleted or some kind of UI 
              //i.e. countdown until its actually deleted?
                  //ability to undo?

  const renderPlaces = ({ item, index }) => {
      return (
        <View style={styles.itemContainer}>
          <ManualSwipeableRow
            item={item} 
            index={index+1}
            handleDeleteItem={handleDeleteItem}
            // handleSwipeLeft={handleSwipeLeft}
            // handleSwipeRight={handleSwipeRight}
          />
          {/* {tempIsSwiped &&
            // isSwipedLeft && 
              <TouchableOpacity
                onPress={() => handleDeleteItem(item)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
          } */}
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
