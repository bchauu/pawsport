import React, {useState, useEffect} from "react";
import { View, Text,Image, Button, TouchableOpacity} from "react-native";
import axios from "axios";
import { Paragraph } from 'react-native-paper';
import AddTravelModal from "../trips/AddTravelModal";
import PlaceDetails from "./PlaceDetails";
import { useTrip } from "../../context/TripContext";
import { TripLocation } from "../../types/types";
import { getToken } from "../../utils/authStorage";
import config from "../../config";


const Place = ({reviews, setReviews, placeDetail, index, setIsSearchInitiated, isSearchInitiated}) => {
    const {locations, setLocation} = useTrip<TripLocation[]>([]);
    // const [reviews, setReviews] = useState([]);

    console.log(placeDetail.name, placeDetail.placeId, 'placeDetails')

    const {lat, lng } = placeDetail.location,
    {name, placeId} = placeDetail;

    //dont need photo, they can click more details which will pull up photos along with details
    const currentPlace: TripLocation = {
    name,
    lat,
    lng,
    placeId
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
        setIsSearchInitiated(false);
    }, [isSearchInitiated])

    const handleAddTrip = async (selectedList) => {

        //post request to save to specific list.
        const token = await getToken();
        const { apiUrl } = await config();

        try {
            console.log(placeId, 'placeId in place')
            const response = await axios.post(`${apiUrl}/trips/lists/places`,{
                name: name,
                lat: lat,
                lng: lng,
                travelListId: selectedList.id,
                placeId: placeId 
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        } catch (error) {
            console.log(error)
        }

      
        
        setLocation((prevLocations) => {   
            const updatedLocations = [...prevLocations, currentPlace];

            return updatedLocations;

        });

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
            <PlaceDetails
                placeId={placeDetail.placeId}
                reviews={reviews}
                setReviews={setReviews}
            ></PlaceDetails>
            <AddTravelModal allTravelList={allTravelList} handleAddTrip={handleAddTrip}></AddTravelModal>
        </View>
    )
}

export default Place;