import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Button } from 'react-native';

const CustomDropdown = ({setIsSharedList, allTravelList, selectedTrip, setSelectedTrip, handleSelect, sharedListWithUser}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);  //initial opening of dropdown
  const [expandedCategory, setExpandedCategory] = useState({}); //nested. reveals items in parent
  const [value, setValue] = useState(null); // --> this needs to be in parent so i can update and pass to trip
  const [items, setItems] = useState([])

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setExpandedCategory((prev) => !prev);
  };

  const toggleCategory = (category) => {    //holds each separate parent value, hence why we need ...prev
    setExpandedCategory((prev) => ({
      ...prev,
      [category]: !prev[category], 
    }));
  };

  const handleDropDownValue = (label, value, category) => {
    console.log(label, value, category, 'setDropDownValue')
    if (category === 'travelList') {
      setIsSharedList(false)
    } else if ('sharedList') {
      console.log('shows sharedList')
      setIsSharedList(true);
    }
    setValue(value);
    setDropdownOpen(false);
    setExpandedCategory(false);
  }

  useEffect(() => {
    if (value) {
      const chosenTripList = allTravelList.filter(trip => trip.id === value);
        setSelectedTrip(chosenTripList[0])
    }
  }, [value]); 

    useEffect(() => {
        if (allTravelList && sharedListWithUser.length > 0) {
            const dropDownTravel = allTravelList.map((trip) => (
                {
                    label: trip.name,
                    value: trip.id,
                    category: 'travelList'
                }
            ));
                dropDownTravel.push({ label: 'Travel List', value: 'travelList', category: null })

            const dropDownShared = sharedListWithUser.map((trip) => (
                {
                    label: trip.travelList.name,
                    value: trip.travelList.id,
                    category: 'sharedList'
                }
            ))

            dropDownShared.push({ label: 'Shared With You', value: 'sharedList', category: null })

            console.log(dropDownTravel, 'dropDownTravel')
            console.log(dropDownShared, 'dropDownShared')

            setItems([...dropDownTravel, ...dropDownShared ])
        }

    }, [allTravelList, sharedListWithUser])

  return (
    <View style={styles.container}>
      {/* Dropdown Trigger */}
      <TouchableOpacity style={styles.dropdownTrigger} onPress={toggleDropdown}>
        <Text>
        Select List
        </Text>
    <Text style={styles.arrow}>⬇️</Text>
      </TouchableOpacity>

      {/* shows dropdown option when set to true */}
      {dropdownOpen && (
        <View style={styles.dropdownMenu}>
          {items.map((item, index) => {
            if (!item.category) { // goes through all items without parent --> null, and renders component for each
              return (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => toggleCategory(item.value)}
                  >
                    <Text style={styles.categoryText}>{item.label}</Text>
                  </TouchableOpacity>
                  {expandedCategory[item.value] &&
                    items       //goes through all items again and filters to make sure their parent 
                      .filter((list) => list.category === item.value)
                      .map((list) => (
                        <TouchableOpacity
                          key={list.value}
                          style={styles.listItem}
                          onPress={() => handleDropDownValue(list.label, list.value, list.category)}
                        >
                          <Text style={styles.listText}>{list.label}</Text>
                        </TouchableOpacity>
                      ))}
                </View>
              );
            }
            return null;
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      justifyContent: 'center',
      left: '50%',
      top: '5%',
      alignItems: 'flex-end',
      width: '40%',     //this needs to be defined or it shifts when expanded
    //   height: '10%', //cant have height
      zIndex: 10, // Ensure dropdown container is also above others
    },
    dropdownTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '40%',
      padding: 10,
      backgroundColor: '#007bff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#007bff',
    },
    dropdownTriggerText: {
      color: '#ffffff',
      fontSize: 16,
    },
    icon: {
      marginLeft: 5,
    },
    dropdownMenu: {
      width: '60%',
      left: '20%',
      backgroundColor: '#ffffff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc',
      overflow: 'hidden',
    },
    categoryItem: {
      padding: 10,
      backgroundColor: '#f0f0f0', // Light gray background for parent items
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0', // Subtle bottom border for separation
    },
    categoryText: {
      fontWeight: 'bold',
      color: '#333333',
    },
    listItem: {
      padding: 10,
      width: '100%',
      paddingLeft: 20, // Indent child items
      backgroundColor: '#ffffff',
    },
    listText: {
      fontSize: 14,
      color: '#666666', // Slightly lighter color for child text
    },
    arrow: {
        fontSize: 16,
      },
  });

export default CustomDropdown;