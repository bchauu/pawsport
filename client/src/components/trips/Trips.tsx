import React, {useState, useEffect} from "react";
import { View, Text, ScrollView } from "react-native";
import { Card } from 'react-native-paper';

const Trips = ({trip}) => {
    console.log(trip.items, 'trips')
    return (
        <View>
            <Text>{trip.name}</Text>
        </View>
    )
}

//render name, notes as list with delete button

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