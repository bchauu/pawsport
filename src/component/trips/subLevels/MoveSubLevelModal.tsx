import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';
import useApiConfig from '../../../utils/apiConfig';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MoveSubLevelModal = ({
  item,
  allTrip,
  tripOrder,
  setTripOrder,
  setHighestValueSubLevel,
  highestValueSubLevel,
  subLevels,
}) => {
  const {theme} = useTheme();
  const [allSubLevels, setAllSubLevels] = useState({});
  const [selectedSubLevel, setSelectedSubLevels] = useState('');
  const {token, apiUrl} = useApiConfig();

  useEffect(() => {
    setAllSubLevels([...subLevels, {name: 'default'}]);
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  const queryChangeSubLevel = async payload => {
    console.log(payload, 'payload');
    try {
      const response = await axios.post(
        `${apiUrl}/trips/lists/places/changesublevel`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data.message, 'response');
      return 'Update succeeded';
    } catch (error) {
      console.log(error, 'error');
      return 'fail swap';
    }
  };

  const handleMoveToNewSubLevel = () => {
    const index = allTrip.indexOf(item);
    setModalVisible(!modalVisible);
    let currentSubLevel = item.subLevelName;

    if (selectedSubLevel.toString() === 'null') {
      allTrip[index].subLevelName = null;
    } else {
      allTrip[index].subLevelName = selectedSubLevel;
    }
    const payload = {
      movedTripItem: {
        id: item.id,
        subLevel: selectedSubLevel,
        value: Number(highestValueSubLevel[selectedSubLevel]) + 1,
      },
    };

    setTripOrder(prev => ({
      ...prev,
      [item.id]: {
        subLevel: selectedSubLevel,
        value: Number(highestValueSubLevel[selectedSubLevel]) + 1,
      },
    }));
    const itemId = item.id,
      shiftUpTripOrder = {};
    for (const id in tripOrder) {
      console.log(tripOrder[id].subLevel, 'previous sub level');
      if (
        tripOrder[id].value > tripOrder[itemId].value &&
        tripOrder[id].subLevel == currentSubLevel
      ) {
        console.log(tripOrder[id].value, tripOrder[id].subLevel, 'id in loop');
        shiftUpTripOrder[id] = {
          subLevel: tripOrder[id].subLevel,
          value: tripOrder[id].value - 1,
        };
      }
    }
    setTripOrder(prev => ({...prev, ...shiftUpTripOrder}));

    payload.shiftedTripItems = shiftUpTripOrder;

    setHighestValueSubLevel({});
    //resets incase value drops lower
    queryChangeSubLevel(payload);
  };

  const handleSelectedSubLevel = async subLevelName => {
    setSelectedSubLevels(subLevelName.toString());

    let highestValueInLoop = 0;
    for (const id in tripOrder) {
      if (
        tripOrder[id].subLevel === subLevelName ||
        (tripOrder[id].subLevel === null && subLevelName.toString() == 'null')
      ) {
        if (tripOrder[id].value > highestValueInLoop) {
          highestValueInLoop = tripOrder[id].value;
        }
      }
    }

    setHighestValueSubLevel(prev => ({
      ...prev,
      [subLevelName.toString()]: highestValueInLoop,
    }));
  };

  return (
    <View style={theme.lists.buttonContainer}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[theme.lists.button]}>
        <Icon name="swap-vert" size={20} color="black" />
      </TouchableOpacity>
      {/* The Modal */}
      {modalVisible && (
        <Modal
          animationType="slide" // Animation can be 'slide', 'fade', or 'none'
          transparent={true} // Transparent to allow the content behind the modal to be visible
          visible={modalVisible} // Show or hide the modal based on state
          onRequestClose={() => {
            setModalVisible(!modalVisible); // Function to handle the back button on Android
          }}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              {allSubLevels?.map((subLevel, key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleSelectedSubLevel(subLevel.name)}>
                  <Text>{subLevel.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={handleMoveToNewSubLevel}
                style={[{...theme.buttons.action}]}>
                <Text style={[{...theme.buttons.actionText}]}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Hide</Text>
              </TouchableOpacity>
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

export default MoveSubLevelModal;
