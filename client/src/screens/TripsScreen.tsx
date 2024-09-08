import React, {useState, useEffect} from 'react';
import {View, Text, Button, ScrollView, FlatList} from 'react-native';
import Trips from '../components/trips/Trips';
import axios from 'axios';
import config from '../../src/config';
import { getToken } from '../utils/authStorage';
import MyMap from '../components/trips/Map';
import CreateTravelListModal from '../components/trips/CreateTravelListModal';


const TripsScreen =  () => {

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const [allTravelList, setAllTravelList] = useState([]);
  const [isCreateNewList, setIsCreateNewList] = useState(false);
  const [InputName, setInputName] = useState(''); //lift state up from modal
  const [hasNewList, setHasNewList] = useState(false); // control rendering of list
  const [selectedTrip, setSelectedTrip] = useState(null);   //id of currently selected

  const getList = async () => {
    const token = await getToken();
    const { apiUrl } = await config();
    const response = await axios.get(`${apiUrl}/trips/lists/places`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
    });
    setAllTravelList([...response.data.travelLists])
   
}

  const handleSelect = (trip) => {
    // setSelectedId(id); // Update the selected ID state
    // console.log(allTravelList[1], 'tripsScreen')
    console.log(trip, 'entire trip instead of id')
    setSelectedTrip(trip);
  };
//have two useEffects --> one for initial and one for when hasnewList is true

  useEffect(() => { //initial
    getList();
    console.log('first time') //this triggers. 
  },[])


  useEffect(() => { //this is to fetch newData after adding list. 
    const fetchList = async () => {
      if (hasNewList) {
        console.log('second time')
        try {
          await delay(500); // Add a .5-second delay here
          await getList();
        } finally {
          setHasNewList(false)
        }
      }
    }
    fetchList();
  }, [hasNewList])

  useEffect(() => { //this is for adding newList
    if (isCreateNewList) {
      console.log(InputName, 'api call')

      const postList = async () => {
        const token = await getToken();
        const { apiUrl } = await config();
        const response = await axios.post(`${apiUrl}/trips/list`, {
          name: InputName,
        },
        {
          headers: {
            'authorization': `Bearer ${token}`
          }
        });
    
        console.log(response, 'adding new list')
      }
      postList();
      setIsCreateNewList(false);
      setInputName('');
      // getList()
      setHasNewList(true); 
    }

  }, [isCreateNewList]) 


  return (
    <View>
      <CreateTravelListModal 
        setIsCreateNewList={setIsCreateNewList}
        setInputName={setInputName}
        InputName={InputName}
        >
        </CreateTravelListModal>
      <FlatList
        data={allTravelList} 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={({ item }) => (
          <Trips 
            trip={item} 
            isSelected={item.id === selectedTrip?.id}
            onSelect={handleSelect}
          />
        )} 
        nestedScrollEnabled={true} 
      />
       <MyMap selectedTrip={selectedTrip}/>
    </View>
  );
};

export default TripsScreen;
