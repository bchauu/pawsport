import {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import axios from 'axios';
import List from '../places/List';
import {useTheme} from '../../context/ThemeContext';
import {useApiConfigContext} from '../../context/ApiConfigContext';

const Recommendations = () => {
  const {theme} = useTheme();
  const [curatedList, setCuratedList] = useState([]);
  const {apiUrl, token} = useApiConfigContext();

  useEffect(() => {
    const getCuratedList = async () => {
      if (token && apiUrl) {
        try {
          const response = await axios.post(
            `${apiUrl}/graphql`,
            {
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
                                
                            }`,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setCuratedList(response.data.data.getCuratedListPlaces.list);
        } catch (error: any) {
          if (error.response.data.error === 'Token expired') {
            console.log(error.error, 'new token needed');
          } else {
            console.log(error, 'anothoer error occurred');
          }
        }
      }
    };

    getCuratedList();
  }, [token, apiUrl]);
  return (
    <View style={theme.list.listContainer}>
      <View style={theme.list.mainHeaderContainer}>
        <Text style={theme.list.mainHeader}>Curated Lists</Text>
      </View>
      <View style={theme.list.list}>
        {curatedList.map((list, index) => (
          <View key={list.id} style={theme.list.sectionCard}>
            <View style={theme.list.titleRow}>
              <Text style={theme.list.titleText}>
                {list.name}
                {list.id}
              </Text>
              {/* <TouchableOpacity style={theme.list.saveButton}>
                                <Text style={theme.list.saveButtonText}>
                                    Copy Itinerary
                                </Text> */}
              {/* ability to add entire list and all its trips to the user --> copy travelList and assign to specificied userID*/}
              {/* items need to be cloned as well*/}
              {/* </TouchableOpacity> */}
            </View>
            <List key={index} places={list.items} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default Recommendations;
