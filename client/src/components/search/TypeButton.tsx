import React from 'react';
import { View, ScrollView, Button,TextInput, StyleSheet } from 'react-native';
import { SearchField } from "../../types/types";

const ButtonSlider: React.FC<SearchField> = ({ enteredQuery, updateQuery }) => {
    const buttonTypes = [
        { title: 'Restaurant', onPress: () => updateQuery('type', 'restaurant') },
        { title: 'Hotel', onPress: () => updateQuery('type', 'hotel') },
        { title: 'Bar', onPress: () => updateQuery('type', 'bar') },
        { title: 'Cafe', onPress: () => updateQuery('type', 'cafe') },
        { title: 'Spa', onPress: () => updateQuery('type', 'spa') },
        { title: 'Night Club', onPress: () => updateQuery('type', 'night_club') },
        { title: 'Tourist Attraction', onPress: () => updateQuery('type', 'tourist_attraction') },
        { title: 'Historical Landmark', onPress: () => updateQuery('type', 'historical_landmark') },
        { title: 'Market', onPress: () => updateQuery('type', 'market') },
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