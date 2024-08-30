import React, {useState, useEffect} from "react";
import { View, Text,Image, Button} from "react-native";
import axios from "axios";
import { Paragraph } from 'react-native-paper';
import AddTravelModal from "../trips/addTravelModal";
import { useTrip } from "../../context/TripContext";
import { TripLocation } from "../../types/types";
import { getToken } from "../../utils/authStorage";
import config from "../../config";


const Place = ({placeDetail, index, setIsSearchInitiated, isSearchInitiated}) => {
    const {locations, setLocation} = useTrip<TripLocation[]>([]);
    // console.log(placeDetail, 'places')

    const {lat, lng } = placeDetail.location,
    {name, place_id} = placeDetail;

    //dont need photo, they can click more details which will pull up photos along with details
    const currentPlace: TripLocation = {
    name,
    lat,
    lng,
    place_id
    };

    const [allTravelList, setAllTravelList] = useState([]);

    useEffect(() => {
        const getList = async () => {
            const token = await getToken();
            const { apiUrl } = await config();
            const response = await axios.get(`${apiUrl}/trips/lists/places`, {
                headers: {
                  'authorization': `Bearer ${token}`
                }
            });

            setAllTravelList([...response.data.travelLists])

        }
        getList();
      }, [])

    useEffect(() => {

        setLocation((prevLocations) => {

            const updatedLocations = [...prevLocations, currentPlace];

            return updatedLocations;
        });
        console.log(currentPlace, 'useeffect')
        setIsSearchInitiated(false);
    }, [isSearchInitiated])

    const handleAddTrip = async (selectedList) => {

        //post request to save to specific list.
        const token = await getToken();
        const { apiUrl } = await config();
        console.log(selectedList.id, 'adding from modal')

        try {
            const response = await axios.post(`${apiUrl}/trips/lists/places`,{
                name: name,
                lat: lat,
                lng: lng,
                travelListId: selectedList.id,
                place_id: place_id 
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response)

        } catch (error) {
            console.log(error)
        }

      
        
        setLocation((prevLocations) => {   
            const updatedLocations = [...prevLocations, currentPlace];

            return updatedLocations;

        });
        console.log(locations[index], 'trip context')
        

    }
    return (
        <View
        >
            <Image
                source={{ uri: `${placeDetail.photos[0]?.photoUrl}` }}
                style={{width: 100, height: 100}}
            />
            <Text>
                {placeDetail.name}
            </Text>
            <Paragraph>
                Rating: {placeDetail.rating}
                Total: {placeDetail.user_ratings_total}
            </Paragraph>
            <Paragraph>
                View more:
            </Paragraph>
            <AddTravelModal allTravelList={allTravelList} handleAddTrip={handleAddTrip}></AddTravelModal>
        </View>
    )
}

export default Place;