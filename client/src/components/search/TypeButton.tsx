import React from 'react';
import { View, ScrollView, Button,TextInput, StyleSheet } from 'react-native';
import { SearchField } from "../../types/types";
import { useSearch } from '../../context/SearchContext';

const ButtonSlider: React.FC<SearchField> = ({ enteredQuery, updateSearchTypeupdateQuery }) => {
    const {searchValue, setSearchValue} = useSearch();

    const updateSearchType = (type) => {

        setSearchValue({...searchValue, type: type} )
    }

    const buttonTypes = [
        { title: 'Restaurant', onPress: () => updateSearchType('restaurant') },
        { title: 'Hotel', onPress: () => updateSearchType('hotel') },
        { title: 'Bar', onPress: () => updateSearchType('bar') },
        { title: 'Cafe', onPress: () => updateSearchType('cafe') },
        { title: 'Spa', onPress: () => updateSearchType('spa') },
        { title: 'Night Club', onPress: () => updateSearchType('night_club') },
        { title: 'Tourist Attraction', onPress: () => updateSearchType('tourist_attraction') },
        { title: 'Historical Landmark', onPress: () => updateSearchType('historical_landmark') },
        { title: 'Market', onPress: () => updateSearchType('market') },
    ]

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}
        >
            {buttonTypes.map((button, index) => (
                <View key={index} style={styles.buttonContainer}>
                    <Button title={button.title} onPress={button.onPress}></Button>
                </View>
            ))}
        </ScrollView>
    );
}

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