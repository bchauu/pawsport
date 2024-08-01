import React, {useState, useEffect} from "react";
import axios from "axios";
import {View, Button} from 'react-native';
import DescriptionSearch from "../search/DescriptionSearch";
import CountrySearch from "../search/CountrySearch";
import DistrictCitySearch from "../search/DistrictCitySearch";
import config from "../../config";

import { SearchField } from "../../types/types";

//search needs to verify current token
    //use actual stored token and send to backend
    //then make googleapi call

// only use location
        //city typed in: 
            //comma splits up query

//will make two request to google places
    // first is with either one or two of location fields
    // then get coordinates and do a search within for 3.5 if district is included, 10km if only city, and 40km if only country

    //all params should be in client, call will be done in backend

type     EnteredQuery = {
    description: string,
    districtCity: string[],
    country: string
  }

const Search = () => {
    const [enteredQuery, setEnteredQuery] = useState({
        description: "",
        districtCity: [''],
        country: ""
    });
    
    const updateQuery = (searchName: keyof EnteredQuery | string, query: string) => {
        console.log(searchName)

        if (searchName == 'districtCity') {
            const split = query.split(","); //this ensures district city is separated 
            console.log(split);
            setEnteredQuery(prevState => ({
                ...prevState,
                [searchName]: split }));
        } else {
            setEnteredQuery(prevState => ({
                ...prevState,
                [searchName]: query}));
        }
        console.log(enteredQuery);
    };

    const handleSubmit = async () => {
        const payload = {
            query: enteredQuery.description,
            districtCity: enteredQuery.districtCity,
            country: enteredQuery.country,
            radius: '',
            language: 'en',
            type: ''
        },
        districtCity = enteredQuery.districtCity;
        let radius = payload.radius;

        if (districtCity[0] == "" && !districtCity[1]) {
            radius = "30000";
            
        } else if (!districtCity[1] && districtCity[0] != "") {
            radius  = "20000";
        }else {
            radius = "10000";
        }

        // const token = await getToken();
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0dXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcyMjM5MDY1NiwiZXhwIjoxNzIyMzk0MjU2fQ.8s9FtYdDNg4dLOybCfBz3tP6wyGcz05wiqIzTG8riiM'
        console.log(token, 'jere');
        
        try {
            // const response = await axios.post(
            //     `${config}/api/search/location`,
            //     payload);
            //     //send response back to home screen to render result --> need to set up props in homeScreen
            console.log('submit button clicked')
            console.log(config);
            const response = await axios.post(
                `${config.apiUrl}/graphql`, {
                    query: `query {
                        searchPlaces(query: "restaurants in New York") {
                            id 
                            name
                            address
                            latitude
                            longitude
                            types
                            rating
                            userRatingsTotal
                        }
                    }`
                }, {
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            console.log(response);
        } catch (error: any) {
            if (error.response.data === 'Token expired') {
                console.log(error, 'new token needed');
            }
            console.log(error, 'sending search request');
        }
    };

    return (
        <View>
            <DescriptionSearch enteredQuery={enteredQuery} updateQuery={updateQuery}/>
            <DistrictCitySearch enteredQuery={enteredQuery} updateQuery={updateQuery}/>
            <CountrySearch enteredQuery={enteredQuery} updateQuery={updateQuery}/>
            <Button title="Search" onPress={handleSubmit}></Button>
        </View>
    );
}

export default Search;