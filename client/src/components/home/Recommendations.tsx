import {useState, useEffect} from "react";
import { View, Text } from "react-native";
import axios from "axios";
// import { getToken } from "../../utils/authStorage";
// import config from "../../config";
import useApiConfig from "../../utils/apiConfig";


const Recommendations = () => {
    const [curatedList, setCuratedList] = useState([]);
    const {token, apiUrl} = useApiConfig();

    useEffect(() => {
        const getCuratedList = async () => {
            if (token && apiUrl) {
                try {
                    //need to setup backend to fetch
                        //ensure it returns same format as search
                        //should first fetch from database
                            //then map through all places and make api google search for all with place_id
                            //return all of that in new list to be returned here --> will have list of all details
                            console.log('getCuratedList')
                    const response = await axios.post(
                        `${apiUrl}/graphql`, {
                            query: `query {
                                getCuratedListPlaces(userId: "null") { 
                                    list {
                                      id
                                      name
                                      createdAt

                                      items {
                                        name
                                        location {
                                          lat
                                          lng
                                        }
                                        businessStatus
                                        placeId
                                        rating
                                        vicinity
                                        types
                                        address
                                        userRatingTotal
                                        lastUpdated
                                        photos {
                                          height
                                          photoReference
                                          width
                                          photoUrl
                                        }
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
                    console.log(response.data.data.getCuratedListPlaces.list, 'handleGoogleUrl from graphql');
                    // setDirectSearchResult(response.data.data.resolveAndExtractPlace.result);
           
                } catch (error: any) {
                    if (error.response.data.error === 'Token expired') {
                        console.log(error.error, 'new token needed');
                    } else {
                        console.log(error, 'anothoer error occurred')
                    }
                }
            }
        }

        getCuratedList();

      }, [token, apiUrl])        

        //this can pass in data to same as search for trips
            //because need exact or very similar format
    return (
        <View>
            <Text>
                Curated lists
            </Text>
        </View>
    )
}

export default Recommendations;

//curated list