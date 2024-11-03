import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';

const ManualSwipeableRow = ({item, index, handleSwipeLeft, handleSwipeRight, isSwipedLeft}) => {
  const translateX = useRef(new Animated.Value(0)).current; // Animated value for translation

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
          handleSwipeLeft(item)
          console.log(item.name, 'Deleted action')
          Animated.spring(translateX, {
            toValue: -20, // Swipe item to the right, adjust as needed
            useNativeDriver: true,
          }).start();
        }

        if (gestureState.dx > 0) {
          handleSwipeRight(item)
          console.log('Move Item Back')
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
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers} // Attach the pan responder
      style={[styles.container, { transform: [{ translateX }] }]}>
        <Text style={styles.number}>{index}.</Text>  
        <Text style={styles.itemText}>{item.name}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    position: 'relative'
  },
  container: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
  },
  number: {
    marginRight: 10,       // Space between number and text
    fontSize: 16,
    fontWeight: 'bold',    // Make the number bold
  },
  itemText: {
    fontSize: 16,
  },
  hiddenDeleteButton: {
    opacity: 0.0
  }, 
  deleteButton: {
    opacity: 1
  }
});

export default ManualSwipeableRow;