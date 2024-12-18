import React, {useState, useEffect} from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from 'react-native-paper';
import Place from "./Place";
import { useTheme } from "../../context/ThemeContext";

const List = ({places, isSearchInitiated, setIsSearchInitiated}) => {
    const { theme } = useTheme();
    const [hasList, setHasList] = useState(true)
    const [reviews, setReviews] = useState({});

    useEffect(() => {
        if (places.length > 0) {
            setHasList(true);
        } else {
            setHasList(false); // Reset if places becomes empty
        }
    }, [places]); // Ensures this effect runs whenever `places` changes

    return (
        <>
          {hasList ? (
            <ScrollView 
            horizontal
            // style={[{...theme.list.container}]}
            >
              {places?.map((place, index) => (
                <Card key={place.place_id} style={styles.container} >
                  <Card.Content style={theme.card.cardContainer}>
                    <Place
                      reviews={reviews}
                      setReviews={setReviews}
                      placeDetail={place}
                      index={index}
                      setIsSearchInitiated={setIsSearchInitiated}
                      isSearchInitiated={isSearchInitiated}
                    />
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <Text></Text>
          )}
        </>
      );
};

const styles = StyleSheet.create({
    container: {
      // backgroundColor: '#ffffff', // Ensure correct color
      padding: 16,
      margin: 8,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemContainer: {
      // backgroundColor: '#fff',
      // borderRadius: 12, // Rounded corners
      // shadowColor: '#000', // Subtle shadow
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.1,
      // shadowRadius: 4,
      // elevation: 2, // Shadow for Android
      // padding: 12, // Space inside the card
      // marginBottom: 16, // Space between cards
      // // width: '48%', // Responsive width for two cards per row
    },
    itemText: {
      // color: colors.main.text,
      fontSize: 16,
      fontFamily: 'Roboto-Regular',
    },
})


export default List;
