import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import MoveSubLevelModal from '../subLevels/MoveSubLevelModal';
import {useTheme} from '../../../context/ThemeContext';

const ManualSwipeableRow = ({
  item,
  index,
  handleDeleteItem,
  setItemIsNotesCollapsed,
  handleTripOrderChange,
  tripOrder,
  setTripOrder,
  allTrip,
  highestValueSubLevel,
  setHighestValueSubLevel,
  subLevels,
}) => {
  const {theme} = useTheme();
  const translateX = useRef(new Animated.Value(0)).current; // Animated value for translation
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);

  const handleSwipeLeft = () => {
    setIsSwipedLeft(true);
  };

  const handleSwipeRight = () => {
    setIsSwipedLeft(false);
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20; // Start swipe if moved enough
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx); // Update the translation
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -20) {
          handleSwipeLeft();
          // setIsSwipedLeft(true)

          Animated.spring(translateX, {
            toValue: -20, // Swipe item to the right, adjust as needed
            useNativeDriver: true,
          }).start();
        }

        if (gestureState.dx > 0) {
          // handleSwipeRight(item)
          handleSwipeRight();
          Animated.spring(translateX, {
            toValue: 0, // Swipe item to the right, adjust as needed
            useNativeDriver: true,
          }).start();
        }
        // Reset position
        // Animated.spring(translateX, {
        //   toValue: 0,
        //   useNativeDriver: true,
        // }).start();
      },
    }),
  ).current;

  const handleCollapse = () => {
    setItemIsNotesCollapsed(prevState => ({
      ...prevState,
      [item.id]: {isCollapsed: !prevState[item.id].isCollapsed},
    }));
  };

  const test = () => {
    console.log(item, 'item in delete'); //needs to have id
  };

  return (
    <Animated.View
      {...panResponder.panHandlers} // Attach the pan responder
      style={[styles.container, {transform: [{translateX}]}]}>
      <View style={styles.itemContainer}>
        <View style={theme.personalList.itemTitle}>
          <TouchableOpacity onPress={() => handleCollapse()}>
            <Text>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => test()}>
            <Text>{'test'}</Text>
          </TouchableOpacity>
          <Text style={styles.number}>{index}.</Text>
          <Text style={theme.personalList.listItem}>{item.name}</Text>
        </View>
        <View style={theme.personalList.itemButtons}>
          <TouchableOpacity
            onPress={() => handleTripOrderChange(tripOrder, item)}>
            <Text>Up Arrow</Text>
          </TouchableOpacity>
          <MoveSubLevelModal
            item={item}
            allTrip={allTrip}
            tripOrder={tripOrder}
            setTripOrder={setTripOrder}
            setHighestValueSubLevel={setHighestValueSubLevel}
            highestValueSubLevel={highestValueSubLevel}
            subLevels={subLevels}
          />
        </View>
      </View>
      {isSwipedLeft && (
        <TouchableOpacity
          onPress={() => handleDeleteItem(item)}
          style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '99.5%',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 0,
    shadowOpacity: 0.3,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  number: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
  },
  deleteText: {
    color: '#d32f2f',
  },
  deleteButton: {
    backgroundColor: '#e0e0e0',
    // alignContent: 'center',
    justifyContent: 'center',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {width: 1.5, height: 1.5}, // Right shadow only
    shadowOpacity: 0.2,
  },
});

export default ManualSwipeableRow;
