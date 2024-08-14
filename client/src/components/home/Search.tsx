import React, {useState, useEffect} from "react";
import axios from "axios";
import {View, Button, Alert} from 'react-native';
import LocationSearch from "../search/LocationSearch";
import ButtonSlider from "../search/TypeButton";
import { getToken } from "../../utils/authStorage";
import config from "../../config";

type EnteredQuery = {
    Location: string,
    type: string
  }

const Search = () => {
    const [enteredQuery, setEnteredQuery] = useState({
        location: "",
        type: ""
    });
    
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
                        searchPlaces(query: "${enteredQuery.location}", type: "${enteredQuery.type}", radius: 1500) {
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
            console.log(response.data.data.searchPlaces.result[0].photos);
        } catch (error: any) {
            if (error.response.data.error === 'Token expired') {
                console.log(error.error, 'new token needed');
            } else {

                console.log(error.response.data, 'sending search request');
            }
        }
    };

    return (
        <View>
            <LocationSearch enteredQuery={enteredQuery} updateQuery={updateQuery}></LocationSearch>
            <ButtonSlider enteredQuery={enteredQuery} updateQuery={updateQuery}></ButtonSlider>
            <Button title="Search" onPress={handleSubmit}></Button>
        </View>
    );
}

export default Search;