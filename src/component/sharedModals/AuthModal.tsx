import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import LoginField from '../account/LoginField';

const AuthModal = ({modalName}) => {
  const {theme} = useTheme();

  //we need to trigger an entire refresh on when logged in
  //so we should add to useeffect and then ensure request only runs if token exist
  //otherwise their list isnt fetched
  //create dummy data for default list for when they havent logged in

  //add auth modal to all areas that require auth. otherwise it throws an error if not logged in anyways

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={theme.card.buttonContainer}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[theme.card.button]}>
        <Text style={[theme.card.buttonText]}>{modalName}</Text>
      </TouchableOpacity>
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <LoginField />
              <Button
                title="Hide"
                onPress={() => setModalVisible(!modalVisible)}
              />
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
    shadowOffset: {width: 0, height: 2},
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

export default AuthModal;

//create modal will specify which list of trips to be added to.
//trips will add location to certain part of list
