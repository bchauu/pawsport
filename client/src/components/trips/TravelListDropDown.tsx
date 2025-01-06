import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const TravelListDropdown = ({allTravelList, selectedTrip, setSelectedTrip, handleSelect}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null); // --> this needs to be in parent so i can update and pass to trip

  const [items, setItems] = useState([
  ]);

    useEffect(() => {
      if (allTravelList.length > 0) {
        const dropdownItems = allTravelList.map(trip => ({
          label: trip.name,  // Display the trip name
          value: trip.id     // Use the trip id as the value
        }));
  
        setItems(dropdownItems);  
      }
    }, [allTravelList]); 

    useEffect(() => {
      if (value) {
        const chosenTripList = allTravelList.filter(trip => trip.id === value);
          setSelectedTrip(chosenTripList[0])
      }
    }, [value]); 


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select a Trip:</Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={styles.dropdown} // Styling the main dropdown button
        dropDownContainerStyle={styles.dropdownContainer} // Styling the dropdown list container
        textStyle={styles.dropdownText} // Styling the text inside the dropdown
        placeholder="Select a travel..."
        placeholderStyle={styles.placeholder} // Styling the placeholder text
      />
      {value && <Text style={styles.selectedText}>You selected: {value}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      padding: 10,
      backgroundColor: '#f0f0f0',
      zIndex: 1000, // Ensure dropdown container is also above others
    },
    label: {
      fontSize: 18,
      marginBottom: 10,
      alignSelf: 'flex-end',
    },
    dropdown: {
      width: 160,
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      marginLeft: 'auto',
      zIndex: 1000, // Set a high zIndex for dropdown to appear on top
    },
    dropdownContainer: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      marginTop: 2,
      width: 160,
      position: 'absolute', // Use absolute positioning if needed
      zIndex: 1000, // Ensure dropdown container is also above others
      alignSelf: 'flex-end',
    },
    dropdownText: {
      fontSize: 15,
      color: 'black',
      textAlign: 'right',
    },
    placeholder: {
      color: 'gray',
      fontSize: 14,
      textAlign: 'right',
    },
    selectedText: {
      marginTop: 20,
      fontSize: 16,
      color: 'blue',
      alignSelf: 'flex-end',
    },
  });

export default TravelListDropdown;