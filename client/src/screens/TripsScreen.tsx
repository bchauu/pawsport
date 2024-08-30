import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import Trips from '../components/trips/Trips';
import axios from 'axios';
import config from '../../src/config';
import { getToken } from '../utils/authStorage';


const TripsScreen =  () => {

  //api call to get list for user

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
        // console.log(response.data.travelLists[0].name);
        setAllTravelList([...response.data.travelLists])
        console.log(allTravelList[0]?.items[0], 'tripsScreen')
    }
    getList();
  }, [])

  const handleCreateTravelList = async () => {
    const token = await getToken();
    const { apiUrl } = await config();
    const response = await axios.post(`${apiUrl}/trips/list`, {
      name: 'Bangkok Travels',
    },
    {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    console.log(response, 'adding new list')
  }


  return (
    <View>
      <Text>Trips Screen</Text>
      <Text>All Trips go under here</Text>
      <Button title='Create New List' onPress={handleCreateTravelList}/>
       { allTravelList?.map((trip, index) => (
          <Trips
              key={index}
              trip={trip}
              // tripPlaces={items}
          />
       ))}
    </View>
  );
};

export default TripsScreen;
