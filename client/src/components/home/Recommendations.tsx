import {useState, useEffect} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
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
                    setCuratedList(response.data.data.getCuratedListPlaces.list)
           
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
    return (
        <View>
            <Text>
                Curated lists
            </Text>
            {
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

export default Recommendations;
