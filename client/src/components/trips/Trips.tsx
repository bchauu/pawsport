import React, {useState, useEffect} from "react";
import { View, Text, TextInput, ScrollView, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import axios from 'axios';
import useApiConfig from "../../utils/apiConfig";
import Share from "./Share";
import CollaboratorsModal from "./CollaboratorsModal";


const Trips = ({trip}) => {
  const [hasUpdatedSharedUser, setHasUpdatedSharedUser] = useState(false);
  const {token, apiUrl} = useApiConfig();

  const handleShare = async (input) => {
    console.log(input, 'trip')

    try {
      const response = await axios.post(`${apiUrl}/permissions/grant`, {
          travelListId: trip.id, 
          // sharedEmail: 'beecee12@gmail.com',
          sharedEmail: `${input}`,
             sharedUserName: '' //should be one field. adjust backend to only use one field and check for both user and email
        },
        {
          headers: {
            'authorization': `Bearer ${token}`
          }
        }
      )
      console.log(response, 'response from sharing')
      setHasUpdatedSharedUser(true);
    } catch (error) {
        if (error.response.status === 409) {

          console.log(error.response.status, error.response.data.message);
        }
    }

    
  }
  
    const renderPlaces = ({ item, index }) => {
        return (
          <View style={styles.itemContainer}>
            <Text style={styles.number}>{index + 1}.</Text>  
            <Text style={styles.itemText}>{item.name}</Text>
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
                    data={trip?.items}
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
