import React, {useState, useEffect} from "react";
import axios from "axios";
import {View, Button,Text, Alert} from 'react-native';
import LocationSearch from "../search/LocationSearch";
import ButtonSlider from "../search/TypeButton";
import Place from "../places/Place";
import List from "../places/List";
import { getToken } from "../../utils/authStorage";
import config from "../../config";

type EnteredQuery = {
    Location: string,
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

const Search = () => {
    const [enteredQuery, setEnteredQuery] = useState({
        location: "",
        type: ""
    });

    const [places, setPlaces] = useState<Place[]>([]);
    const [nextPage, setNextPage] = useState<String>('');

    const updateQuery = (searchName: keyof EnteredQuery | string, query: string) => {
        console.log(searchName, enteredQuery)

        setEnteredQuery(prevState => ({
            ...prevState,
            [searchName]: query}));
    };



    const handleSubmit = async () => {

        const token = await getToken();
        console.log(token, 'jere');
        
        try {
            console.log(config);
            const response = await axios.post(
                `${config.apiUrl}/graphql`, {
                    query: `query {
                        searchPlaces(query: "${enteredQuery.location}", type: "${enteredQuery.type}", radius: 4500) {
                                result {
                                    name
                                    location {
                                        lat
                                        lng
                                    }
                                    business_status
                                    place_id
                                    rating
                                    price_level
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
            console.log(nextPage, 'state');
        } catch (error: any) {
            if (error.response.data.error === 'Token expired') {
                console.log(error.error, 'new token needed');
            } else {

                console.log(error.response.data, 'sending search request');
            }
        }
    };

    const handleNextPage = async () => {
        const token = await getToken();
        console.log(token, 'jere');
        
        try {
            console.log(config);
            const response = await axios.post(
                `${config.apiUrl}/graphql`, {
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
            console.log(nextPage, 'state');
        } catch (error: any) {
            if (error.response.data.error === 'Token expired') {
                console.log(error.error, 'new token needed');
            } else {

                console.log(error.response.data, 'sending search request');
            }
        }
    }

    return (
        <View>
            <LocationSearch enteredQuery={enteredQuery} updateQuery={updateQuery}></LocationSearch>
            <ButtonSlider enteredQuery={enteredQuery} updateQuery={updateQuery}></ButtonSlider>
            <Button title="Search" onPress={handleSubmit}></Button>
            <List places={places} ></List>
        {nextPage ? 
            <Button title="next:" onPress={handleNextPage}></Button>
            :
            <></>
        
    }
           
        </View>
    );
}

export default Search;