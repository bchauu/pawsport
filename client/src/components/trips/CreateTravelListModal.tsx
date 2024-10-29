import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useTrip } from "../../context/TripContext";
import axios from 'axios';

const CreateTravelListModal = ({setIsCreateNewList, InputName, setInputName}) => {
  console.log('create modal')
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddtoTravelList = () => {
    setModalVisible(false);
    setIsCreateNewList(true);
  };

  const handleInputName = (value) => {
    setInputName(value);
  };

  return (
    <View >
      {/* Button to open the modal */}
      <Button title="Add to Travels" onPress={() => setModalVisible(true)} />

      {/* The Modal */}
      <Modal
        animationType="slide" // Animation type can be 'slide', 'fade', or 'none'
        transparent={true} // Allows content behind the modal to be visible
        visible={modalVisible} // Controls the modal's visibility
        onRequestClose={() => {
          setModalVisible(false); // Function to handle the back button on Android
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add to which Travels?</Text>
            <TextInput 
                placeholder='Enter Travel Name' 
                value={InputName} 
                onChangeText={handleInputName}
                style={styles.input}
            />
            <Button title="Create New List" onPress={handleAddtoTravelList} />
            <Button title="Hide" onPress={() => setModalVisible(false)} />
          </View>
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

export default CreateTravelListModal;