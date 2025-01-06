import React, {useState, useEffect} from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from 'react-native-paper';
import Place from "./Place";
import { useTheme } from "../../context/ThemeContext";
import useApiConfig from "../../utils/apiConfig";

const List = ({places, isSearchInitiated, setIsSearchInitiated}) => {
    const { theme } = useTheme();
    const [hasList, setHasList] = useState(true)
    const [reviews, setReviews] = useState({});
    const {token} = useApiConfig();

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
            >
              {places?.map((place, index) => (
                <Card key={place.place_id || place.placeId} style={styles.container} >
                  <Card.Content style={theme.card.cardContainer}>
                    <Place
                      reviews={reviews}
                      setReviews={setReviews}
                      placeDetail={place}
                      index={index}
                      setIsSearchInitiated={setIsSearchInitiated}
                      isSearchInitiated={isSearchInitiated}
                      token={token}
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
      padding: 16,
      margin: 8,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemText: {
      fontSize: 16,
      fontFamily: 'Roboto-Regular',
    },
})


export default List;
