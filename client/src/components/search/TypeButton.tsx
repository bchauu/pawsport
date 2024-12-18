import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from "../../context/ThemeContext";

const ButtonSlider = () => {
    const { theme } = useTheme();
    const { searchValue, setSearchValue } = useSearch();
    const [selectedType, setSelectedType] = useState(null); // Track the selected type

    const updateSearchType = (type) => {
        if (selectedType === type) return setSelectedType(null)
        setSelectedType(type); // Update selected button type
        setSearchValue({ ...searchValue, type: type });
    };

    const buttonTypes = [
        { title: 'Restaurant', type: 'restaurant' },
        { title: 'Hotel', type: 'hotel' },
        { title: 'Bar', type: 'bar' },
        { title: 'Cafe', type: 'cafe' },
        { title: 'Spa', type: 'spa' },
        { title: 'Night Club', type: 'night_club' },
        { title: 'Tourist Attraction', type: 'tourist_attraction' },
        { title: 'Historical Landmark', type: 'historical_landmark' },
        { title: 'Market', type: 'market' },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}
        >
            {buttonTypes.map((button, index) => (
                <View key={index} style={[styles.buttonContainer, theme.padding.default]}>
                    <TouchableOpacity
                        onPress={() => updateSearchType(button.type)}
                        style={[
                            theme.filterButton.default,
                            selectedType === button.type && theme.filterButton.selected, 
                        ]}
                    >
                        <Text
                            style={[
                                theme.filterButton.text,
                                selectedType === button.type && theme.filterButton.selectedText, 
                            ]}
                        >
                            {button.title}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    buttonContainer: {
        marginHorizontal: 5,
    },
});

export default ButtonSlider;