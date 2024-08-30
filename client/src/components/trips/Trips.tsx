import React, {useState, useEffect} from "react";
import { View, Text, ScrollView, FlatList, StyleSheet } from "react-native";
import { Card } from 'react-native-paper';

const Trips = ({trip, tripPlaces}) => {
    console.log(trip.items[0], 'trips')


    // console.log(tripPlaces, 'trips')
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
            <Text>{trip.name}</Text>
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


// const List = ({places}) => {
//     const [hasList, setHasList] = useState(false)
//     const [trips, setTrips] = useState([]);
//         //trips will be an array of trip lists
//             //each trip will have a name
//                 // will have name of each place, along with coordinates
//                 // remove button - ability to remove from list
//                 // trips: [place1: {
//                 //     name, 
//                 //     coordinates,
//                 //     removed? boolean,
//                 //      place_id
//                 //      notes
//                 // }
//                 // ]
// console.log(places, 'List component')

// useEffect(() => {
//     if (places.length > 0) {
//         setHasList(true);
//     } else {
//         setHasList(false); // Reset if places becomes empty
//     }
//     console.log(hasList)
// }, [places]); // Ensures this effect runs whenever `places` changes

// return (
//     <>
//         {hasList ? (
//             <View>
//                 {/* { places?.map((place, index) => (
//                     <Card key={place.place_id} style={{ marginBottom: 10 }}>
//                         <Card.Content>
//                             <Place placeDetail={place} />
//                         </Card.Content>
//                     </Card>
//                 ))} */}
//             </View>
//         ) : (
//             <Text>No places available</Text>
//         )}
//     </>
//     );
// };


// export default List;


// //all list should have data
//     // location with photo
//     // details
//     // these are list of places

// // i need list of trips
//     //trips will have places like the ones shown
//     //need contex
    


// //home    //search --> places --> details

//         //trips --> state here