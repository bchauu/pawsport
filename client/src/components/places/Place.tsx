import React, {useState, useEffect} from "react";
import { View, Text,Image, Button, TouchableOpacity} from "react-native";
import axios from "axios";
import { Paragraph } from 'react-native-paper';
import AddTravelModal from "../trips/AddTravelModal";
import PlaceDetails from "./PlaceDetails";
import { useTrip } from "../../context/TripContext";
import { TripLocation } from "../../types/types";
import { useTheme } from "../../context/ThemeContext";
import { useAllTrips } from "../../context/AllTripsContext";
import { useApiConfigContext } from "../../context/ApiConfigContext";


const Place = ({reviews, setReviews, placeDetail, index, setIsSearchInitiated, isSearchInitiated}) => {
    const { theme } = useTheme();
    const {locations, setLocation} = useTrip<TripLocation[]>([]);
    const { apiUrl, token } = useApiConfigContext();

    const {lat, lng} = placeDetail.location,
    {name, placeId} = placeDetail;

    //dont need photo, they can click more details which will pull up photos along with details
    const currentPlace: TripLocation = {
    name,
    lat,
    lng,
    placeId
    };

    const [allTravelList, setAllTravelList] = useState([]);
    const { allTrip, setAllTrip } = useAllTrips();

    useEffect(() => {
        const getList = async () => {
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
        if (setIsSearchInitiated) {

            setIsSearchInitiated(false);
        }
    }, [isSearchInitiated])

    const handleAddTrip = async (selectedList) => {

        try {
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

            if (response.status === 201) {
                allTravelList.map((list, index) => {
                    if (list.id === selectedList.id) {
                        console.log('found', index)
                        const descendingItemOrder = list.items
                            .filter((trip) => trip.subLevelName === 'default')
                            .sort((a,b) => Number(a.order) - Number(b.order))
                            console.log(descendingItemOrder, 'highestOrder')
                        
                        const highestOrder = descendingItemOrder[descendingItemOrder.length - 1].order;
                        console.log(highestOrder, 'number')
    
                        setAllTrip((prev) => [
                            ...prev,
                            {
                              order: Number(highestOrder) + 1,
                              name: name,
                              lat: lat,
                              lng: lng,
                              travelListId: selectedList.id,
                              placeId: placeId,
                              subLevelName: 'default',
                            },
                          ]);
                    }
                })
            }

        } catch (error) {
            console.log(error)
        }
        
        setLocation((prevLocations) => {   
            const updatedLocations = [...prevLocations, currentPlace];

            return updatedLocations;

        });

    }
    return (
        <View>
            <Image
                source={{ uri: `${placeDetail.photos[0]?.photoUrl}` }}
                style={[theme.card.cardImage]}
            />
            <Text style={[theme.card.cardTitle]}>
                {placeDetail.name}
            </Text>
            <Paragraph style={[theme.card.cardDetails]}>
                Rating: {placeDetail.rating}
                Total: {placeDetail.userRatingTotal}
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