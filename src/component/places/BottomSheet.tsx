import React, {useState} from 'react';
import {
  View,
  Modal,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import useApiConfig from '../../utils/apiConfig';
import axios from 'axios';

const ListSelector = ({
  allTravelList,
  selectedItem,
  isBottomVisible,
  setIsBottomVisible,
}) => {
  const {apiUrl, token} = useApiConfig();

  const handleAddTrip = async selectedList => {
    const {location, name, place_id} = selectedItem;

    try {
      const response = await axios.post(
        `${apiUrl}/trips/lists/places`,
        {
          name: name,
          lat: location.lat,
          lng: location.lat,
          travelListId: selectedList.id,
          place_id: place_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }

    // setLocation((prevLocations) => {
    //     const updatedLocations = [...prevLocations, currentPlace];

    //     return updatedLocations;

    // });
  };

  return (
    <View style={styles.container}>
      <Modal visible={isBottomVisible} transparent={true} animationType="slide">
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>Select a List</Text>
          {allTravelList.map((list, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listItem}
              onPress={() => handleAddTrip(list)}>
              <Text>{list.name}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Close" onPress={() => setIsBottomVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default ListSelector;
