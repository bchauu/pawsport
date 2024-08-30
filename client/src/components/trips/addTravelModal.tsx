import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, TouchableOpacity } from 'react-native';
import { useTrip } from "../../context/TripContext";
import axios from 'axios';

const AddTravelModal = ({allTravelList, handleAddTrip}) => {
    const {locations, setLocation} = useTrip();
    const [selectedList, setSelectedList] = useState({});

  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectedList = (list) => {
    setSelectedList({...list})
    console.log(selectedList, 'selectedList')
  }

  const handleAddtoTravelList = () => {
    handleAddTrip(selectedList) //should setLocation be here?
    setModalVisible(!modalVisible)
  }

  return (
    <View>
      {/* Button to open the modal */}
      <Button title="Add to Travels" onPress={() => setModalVisible(true)} />

      {/* The Modal */}
      <Modal
        animationType="slide" // Animation can be 'slide', 'fade', or 'none'
        transparent={true} // Transparent to allow the content behind the modal to be visible
        visible={modalVisible} // Show or hide the modal based on state
        onRequestClose={() => {
          setModalVisible(!modalVisible); // Function to handle the back button on Android
        }}
      >
        <View>
          <View>
            <Text>Add to which Travels?</Text>
            {allTravelList.map((list, index)=> (
                <Button title={list.name} key={index} onPress={() => handleSelectedList(list)}/>
            ))}
            <Button title="Add to Travel List" onPress={handleAddtoTravelList} />
            <Button title="Hide" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddTravelModal;

//create modal will specify which list of trips to be added to. 
//trips will add location to certain part of list