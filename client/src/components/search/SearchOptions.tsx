import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from "../../context/ThemeContext";

const SearchOptions = ({selectedSearchOption, setSelectedSearchOption}) => {
    const { theme } = useTheme();
    const { searchValue, setSearchValue } = useSearch();

    const updateSearchOption = (type) => {
            setSelectedSearchOption(type); // Update selected button type
        setSearchValue({ ...searchValue, type: type });
    };

    const buttonTypes = [
        { title: 'Google Maps Link', type: 'googleMapsLink' },
        { title: 'Find Nearby Locations', type: 'findNearby' },
    ];

    return (
        <View
            style={styles.mainContainer}
        >
            {buttonTypes.map((button, index) => (
                <View key={index} style={[styles.buttonContainer, theme.padding.default]}>
                    <TouchableOpacity
                        onPress={() => updateSearchOption(button.type)}
                        style={[
                            theme.filterButton.default,
                            selectedSearchOption === button.type && theme.filterButton.selected, 
                        ]}
                    >
                        <Text
                            style={[
                                
                                 theme.filterButton.text,
                                 {fontSize: 15},
                                selectedSearchOption === button.type && theme.filterButton.selectedText, 
                            ]}
                        >
                            {button.title}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        paddingHorizontal: 0,
    },
    buttonContainer: {
        fontSize: 14
        // marginHorizontal: 5,
    },
    text: {
       
        fontSize: 14
    }
});

export default SearchOptions;