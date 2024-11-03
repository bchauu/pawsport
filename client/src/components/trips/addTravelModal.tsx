import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const AddTravelModal = ({allTravelList, handleAddTrip}) => {
  const [selectedList, setSelectedList] = useState({});

  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectedList = (list) => {
    setSelectedList({...list})
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
      {modalVisible && (
        <Modal
        animationType="slide" // Animation can be 'slide', 'fade', or 'none'
        transparent={true} // Transparent to allow the content behind the modal to be visible
        visible={modalVisible} // Show or hide the modal based on state
        onRequestClose={() => {
          setModalVisible(!modalVisible); // Function to handle the back button on Android
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text>Add to which Travels?</Text>
            {allTravelList.map((list, index)=> (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectedList(list)}
                    // do the same as trips to handle selected background
                >
                  <Text>{list.name}</Text>
                </TouchableOpacity>
            ))}
            <Button title="Add to Travel List" onPress={handleAddtoTravelList} />
            <Button title="Hide" onPress={() => setModalVisible(!modalVisible)} />
          </View>
        </View>
      </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to overlay behind the modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 15,
    width: '100%',
  },
});

export default AddTravelModal;

//create modal will specify which list of trips to be added to. 
//trips will add location to certain part of list