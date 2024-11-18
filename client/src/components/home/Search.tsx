import React, {useState, useEffect} from "react";
import axios from "axios";
import {View, Button, TextInput, TouchableOpacity, Text} from 'react-native';
import LocationSearch from "../search/LocationSearch";
import ButtonSlider from "../search/TypeButton";
import Place from "../places/Place";
import List from "../places/list";
import { getToken } from "../../utils/authStorage";
import config from "../../config";
import { useSearch } from "../../context/SearchContext";
import { useTrip } from "../../context/TripContext";
import DirectSearchPlace from "../places/DirectSearchPlace";

type EnteredQuery = {
    Location: {},
    type: string
  }

interface Place {
    business_status:string | null
    location: {
        lat: number; 
        lng: number;
    }
    name: string
    photos: {
        height: number;
        photo_reference: string;
        width: number;
        photoUrl: string; 
    }
    place_id: string
    rating: number
    types: string[]
    user_ratings_total: number | null
    
}

//clicking view more needs to be able to show more details
    //check whats being returned from backend
        //details modal of more details
            //when clicking view more

const Search = () => {
    const {locations, setLocation} = useTrip();
    console.log(locations, 'what is location')
    const [isSearchInitiated, setIsSearchInitiated] = useState(false);
    const [directSearchResult, setDirectSearchResult] = useState([])
    const {searchValue} = useSearch();

    const [enteredQuery, setEnteredQuery] = useState({
        location: {
            'lat': '',
            'lng': ''
        },
        type: ""
    });

    const [places, setPlaces] = useState<Place[]>([]);
    const [nextPage, setNextPage] = useState<String>('');
    const [googleMapUrl, setGoogleMapUrl] = useState('');

    const updateQuery = (searchName: keyof EnteredQuery | string, query: string) => {

        setEnteredQuery(prevState => ({
            ...prevState,
            [searchName]: query}));

    };

    useEffect(() => {

    }, [])

    // const extractGoogleUrl = (value) => {
    //     const coordinatesRegex = /@-?\d+.\d+/;
    //     const placeTextRegex = /^[A-Za-z0-9+]+$/;
        
    //     //https://www.google.com/maps/place/The+Cups+Coffee+Roastery/@16.0559575,108.2458726,17z/
    //     const url = 'https://www.google.com/maps/place/The+Cups+Coffee+Roastery/@16.0559575,108.2458726,17z/';
    //     const splitUrl = url.split('/');
    //     console.log(splitUrl, 'split url')

    //     if (!splitUrl || splitUrl.length < 7 ) {
    //         return console.log('URL is incomplete or invalid')
    //     }

    //     if (splitUrl[2] !== 'www.google.com') {
    //         return console.log('url is not from google')

    //     } 
    //     if (splitUrl[3] !== 'maps') {
    //         return console.log('please get url from google maps')
    //     }

    //     if (splitUrl[4] === 'place') {
    //         //proceed to validate and extract
    //         let newCoordinates;
    //         let newPlaceText;
    //         if (coordinatesRegex.test(splitUrl[6]) === true) {
    //             newCoordinates = splitUrl[6].split(',').slice(0, 2).join(',')
    //             console.log(newCoordinates, 'newCoordinates');
    //         }

    //         if (placeTextRegex.test(splitUrl[5]) === true) {
    //             newPlaceText = splitUrl[5]
    //             console.log(newPlaceText, 'placeTextRegex')
    //         }
    //         //https://maps.googleapis.com/maps/api/place/textsearch/json?query=The+Cups+Coffee+Roastery&location=16.0559575,108.2458726&radius=100
    //     }



    // }
    // extractGoogleUrl('test')


    const handleSubmit = async () => {
        console.log('handleSubmit')
        const token = await getToken();
        try {
            const { apiUrl } = await config();
            const {location, type} = searchValue;
            const response = await axios.post(
                `${apiUrl}/graphql`, {
                    query: `query {
                        searchPlaces(location: {lat: ${location.lat}, lng: ${location.lng}}, type: "${type}", radius: 4500) {
                                result {
                                    name
                                    location {
                                        lat
                                        lng
                                    }
                                    business_status
                                    address
                                    place_id
                                    rating
                                    price_level
                                    vicinity
                                    types
                                    user_ratings_total
                                    photos {
                                        height
                                        photo_reference
                                        width
                                        photoUrl
                                    }
                                }
                                next_page_token
                        }
                        
                    }`
                },
                {
                    headers : {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            console.log(response.data.data.searchPlaces, 'handleSubmit')
                // should display message to user if it returns empty
            setPlaces([...response.data.data.searchPlaces.result]);
            setNextPage(response.data.data.searchPlaces.next_page_token);
            setIsSearchInitiated(true);
            setLocation([]);
        } catch (error: any) {
            if (error.response.data.error === 'Token expired') {
                console.log(error.error, 'new token needed');
            } else {

            }
        }
    };

    const handleNextPage = async () => {
        const token = await getToken();
        
        try {
            const { apiUrl } = await config();
            const response = await axios.post(
                `${apiUrl}/graphql`, {
                    query: `query {
                        searchPlaces( nextPageToken: "${nextPage}") {
                                result {
                                    name
                                    location {
                                        lat
                                        lng
                                    }
                                    business_status
                                    place_id
                                    rating
                                    types
                                    user_ratings_total
                                    photos {
                                        height
                                        photo_reference
                                        width
                                        photoUrl
                                    }
                                }
                                next_page_token
                        }
                        
                    }`
                },
                {
                    headers : {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            setPlaces([...response.data.data.searchPlaces.result]);
            setNextPage(response.data.data.searchPlaces.next_page_token);
            setIsSearchInitiated(true);
            setLocation([]);
        } catch (error: any) {
            if (error.response.data.error === 'Token expired') {
                console.log(error.error, 'new token needed');
            } else {

                console.log(error.response.data, 'sending search request');
            }
        }
    }

    const handleGoogleUrl = (url) => {
        console.log(url, 'handleGoogleUrl')
        setGoogleMapUrl(url)
    }

    const submitGoogleUrl = async () => {
        const token = await getToken();
        //https://maps.app.goo.gl/1MqRkAnThoXY2eqbA?g_st=com.google.maps.preview.copy`  to test
        //resolveAndExtractPlace(url: "${googleMapUrl}") {
        try {
            const { apiUrl } = await config();
            const response = await axios.post(
                `${apiUrl}/graphql`, {
                    query: `query {
                        resolveAndExtractPlace(url: "https://maps.app.goo.gl/1MqRkAnThoXY2eqbA?g_st=com.google.maps.preview.copy") {
                                result {
                                    name
                                    location {
                                        lat
                                        lng
                                    }
                                    business_status
                                    place_id
                                    rating
                                    vicinity
                                    types
                                    address
                                    user_ratings_total
                                    photos {
                                        height
                                        photo_reference
                                        width
                                        photoUrl
                                    }
                                }
                        }
                        
                    }`
                },
                {
                    headers : {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            console.log(response.data.data.resolveAndExtractPlace, 'handleGoogleUrl');
            setDirectSearchResult(response.data.data.resolveAndExtractPlace.result);
   
        } catch (error: any) {
            if (error.response.data.error === 'Token expired') {
                console.log(error.error, 'new token needed');
            } else {

            }
        }
    }

    

    return (
        <View>
            <LocationSearch enteredQuery={enteredQuery} updateQuery={updateQuery}></LocationSearch>
            <ButtonSlider enteredQuery={enteredQuery} updateQuery={updateQuery}></ButtonSlider>
            <List 
                places={places} 
                setIsSearchInitiated={setIsSearchInitiated} 
                isSearchInitiated={isSearchInitiated} 
            >
            </List>
            <Button title="Search" onPress={handleSubmit}></Button>
  
            {nextPage ? 
                <Button title="next:" 
                onPress={handleNextPage}
                />
                :
                <></>
            }
            <TextInput 
                placeholder="paste googlemaps url..."
                onChangeText={(value) => handleGoogleUrl(value)}
                value={googleMapUrl}
            />
            <TouchableOpacity onPress={() => submitGoogleUrl()}>
                <Text>Submit Google Urls</Text>
            </TouchableOpacity>
            <DirectSearchPlace 
                directSearchResult={directSearchResult}
            >
            </DirectSearchPlace>
        </View>
    );
}

export default Search;