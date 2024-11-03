import React, {useState, useEffect} from "react";
import { View, Text, ScrollView } from "react-native";
import { Card } from 'react-native-paper';
import Place from "./Place";

const List = ({places, isSearchInitiated, setIsSearchInitiated}) => {
    const [hasList, setHasList] = useState(false)

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
            <ScrollView horizontal>
              {places?.map((place, index) => (
                <Card key={place.place_id} style={{ marginBottom: 10 }}>
                  <Card.Content>
                    <Place
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
            <Text>No places available</Text>
          )}
        </>
      );
};


export default List;


//all list should have data
    // location with photo
    // details
    // these are list of places

// i need list of trips