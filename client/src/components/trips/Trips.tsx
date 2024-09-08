import React, {useState, useEffect} from "react";
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from 'react-native-paper';

const Trips = ({isSelected, onSelect, trip}) => {
  
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
                onPress={() => onSelect(trip)}
                style={[
                  styles.item, 
                  isSelected && styles.selectedItem
                ]}
            >
                <Text>{trip.name}</Text>
            </TouchableOpacity>
                <FlatList
                    data={trip.items}
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
  });

export default Trips;
