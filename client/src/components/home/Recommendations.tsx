import {useState, useEffect} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
// import { getToken } from "../../utils/authStorage";
// import config from "../../config";
import useApiConfig from "../../utils/apiConfig";
import List from "../places/list";


const Recommendations = () => {
    const [curatedList, setCuratedList] = useState([]);
    // const [isSearchInitiated, setIsSearchInitiated] = useState(false);
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
                                getCuratedListPlaces(listType: "curated") { 
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
                    console.log(response.data.data.getCuratedListPlaces.list[0].items, 'handleGoogleUrl from graphql');
                            //handle submit from search is coming back as an array of objects
                                //each index is an empty thats represented as an object
                    setCuratedList(response.data.data.getCuratedListPlaces.list)
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
            {
                //same as search.
                    // should be able to use same format because i used graphql
                    //import componennt and pass in the list to render in scrollview
                curatedList.map((list, index)=> (
                    <View key={index} >
                        <Text>
                            {list.name}
                        </Text>
                        <TouchableOpacity>
                            <Text>
                                Save curated Trip
                            </Text>
                            {/* ability to add entire list and all its trips to the user --> copy travelList and assign to specificied userID*/}
                            {/* items need to be cloned as well*/}
                        </TouchableOpacity>
                        <List 
                            places={list.items} 
                        >
                        </List>
                    </View>
                ))
            }
        </View>
    )
}
    //confirm searchInitiated doesnt do anything here?

export default Recommendations;

//curated list