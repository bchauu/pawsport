import React, {useState, useEffect} from 'react';
import {View, Text, Image, Button, TouchableOpacity, Alert} from 'react-native';
import axios from 'axios';
import {Paragraph} from 'react-native-paper';
import AddTravelModal from '../trips/AddTravelModal';
import PlaceDetails from './PlaceDetails';
import {useTrip} from '../../context/TripContext';
import {TripLocation} from '../../types/types';
import {useTheme} from '../../context/ThemeContext';
import {useAllTrips} from '../../context/AllTripsContext';
import {useApiConfigContext} from '../../context/ApiConfigContext';
import {useSelectedTripListContext} from '../../context/SelectedTripListContext';
import {useTravelList} from '../../context/AllTravelListContext';

const Place = ({
  reviews,
  setReviews,
  placeDetail,
  index,
  setIsSearchInitiated,
  isSearchInitiated,
}) => {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const {theme} = useTheme();
  const {locations, setLocation} = useTrip<TripLocation[]>([]);
  const {apiUrl, token} = useApiConfigContext();
  const {allTravelList, setAllTravelList} = useTravelList();
  const {selectedTrip, setSelectedTrip} = useSelectedTripListContext();
  const {allTrip, setAllTrip} = useAllTrips();

  const getAddedPlace = async addedItem => {
    //this is everything that needs to be updated for list to be changed

    setAllTrip(prevAllTrip => [...prevAllTrip, addedItem]);

    setSelectedTrip(prevSelectedTrip => ({
      ...prevSelectedTrip,
      items: [...prevSelectedTrip.items, addedItem],
    }));

    setAllTravelList(prevTravelLists =>
      prevTravelLists.map(
        list =>
          list.id === addedItem.travelListId
            ? {...list, items: [...list.items, addedItem]} // Add to matching list
            : list, // Keep other lists unchanged
      ),
    );
  };

  const getList = async () => {
    //this can be moved to tripscreen potentially.
    try {
      const response = await axios.get(`${apiUrl}/trips/lists/places`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const travelLists = response.data.travelLists;

      // Update allTravelList with new data and create a new reference
      setAllTravelList(() =>
        travelLists.map(list => ({
          ...list,
        })),
      );

      // If there's a selected trip, update its state
      const updatedSelectedTrip = travelLists.find(
        list => list.id === selectedTrip?.id,
      );
      if (updatedSelectedTrip) {
        setSelectedTrip({...updatedSelectedTrip});
      }

      // Update allTrip for the currently active trip (if relevant)
      if (selectedTrip && selectedTrip.id) {
        const activeTrip = travelLists.find(
          list => list.id === selectedTrip.id,
        );
        if (activeTrip) {
          setAllTrip(() => [...activeTrip.items]); // Extract items for local updates
        }
      }

      await delay(50);
    } catch (error) {
      console.error('Error fetching travel lists:', error);
    }
  };

  const {lat, lng} = placeDetail.location,
    {name, placeId} = placeDetail;
  // console.log(placeDetail, 'placedetails shoul be missing id')    //direct from google maps

  //dont need photo, they can click more details which will pull up photos along with details
  const currentPlace: TripLocation = {
    name,
    lat,
    lng,
    placeId,
  };

  useEffect(() => {
    const getList = async () => {
      const response = await axios.get(`${apiUrl}/trips/lists/places`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setAllTravelList([...response.data.travelLists]);
    };
    getList();
  }, []);

  useEffect(() => {
    setLocation(prevLocations => {
      const updatedLocations = [...prevLocations, currentPlace];

      return updatedLocations;
    });
    if (setIsSearchInitiated) {
      setIsSearchInitiated(false);
    }
  }, [isSearchInitiated]);

  const handleAddTrip = async selectedList => {
    try {
      const response = await axios.post(
        `${apiUrl}/trips/lists/places`,
        {
          name: name,
          lat: lat,
          lng: lng,
          travelListId: selectedList.id,
          placeId: placeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      getAddedPlace(response.data.item);

      // if (response.status === 201) {
      //     allTravelList.map((list, index) => {
      //         if (list.id === selectedList.id) {
      //             console.log('found', index)
      //             const descendingItemOrder = list.items
      //                 .filter((trip) => trip.subLevelName === 'default')
      //                 .sort((a,b) => Number(a.order) - Number(b.order))
      //                 console.log(descendingItemOrder, 'highestOrder')

      //             const highestOrder = descendingItemOrder[descendingItemOrder.length - 1].order;
      //             console.log(highestOrder, 'number')
      //             const newItem =
      //                 {
      //                     order: Number(highestOrder) + 1,
      //                     name: name,
      //                     lat: lat,
      //                     lng: lng,
      //                     travelListId: selectedList.id,
      //                     placeId: placeId,
      //                     subLevelName: 'default',
      //                 };

      //             setAllTrip((prev) => [
      //                 ...prev,
      //                 {
      //                   order: Number(highestOrder) + 1,
      //                   name: name,
      //                   lat: lat,
      //                   lng: lng,
      //                   travelListId: selectedList.id,
      //                   placeId: placeId,
      //                   subLevelName: 'default',
      //                 },
      //               ]);
      //                 console.log(selectedList.id, 'selectedTrip id')
      //                 console.log(allTravelList, 'all travel list')
      //                     //will use this
      //               if (selectedTrip && selectedTrip.id === selectedList.id) {
      //                 // change selectedList as well
      //                 setSelectedTrip((prevTrip) => ({
      //                     ...prevTrip,
      //                     items: [newItem, ...prevTrip.items],
      //                 }));
      //               } else if (selectedTrip && selectedTrip.id === selectedList.id) {
      //                 // this works when going to another list not selected
      //                     //do the same in directSearch
      //                         //and google search and should be done
      //                     // if (highestOrder) {
      //                         setAllTravelList((prev) =>
      //                             prev.map((list, key) =>
      //                               list.id === selectedList.id // Check if this is the list to update
      //                                 ? {
      //                                     ...list,
      //                                     items: [
      //                                       ...list.items,
      //                                       {
      //                                         order: Number(highestOrder) + 1,    //no order so not added at first
      //                                         name: name,
      //                                         lat: lat,
      //                                         lng: lng,
      //                                         travelListId: selectedList.id,
      //                                         placeId: placeId,
      //                                         subLevelName: 'default',
      //                                       },
      //                                     ],
      //                                   }
      //                                 : list // Keep other lists unchanged
      //                             )
      //                           );
      //                     // }
      //                 // setAllTravelList((prev) =>
      //                 //     prev.map((list, key) =>
      //                 //       list.id === selectedList.id // Check if this is the list to update
      //                 //         ? {
      //                 //             ...list,
      //                 //             items: [
      //                 //               ...list.items,
      //                 //               {
      //                 //                 order: Number(highestOrder) + 1,    //no order so not added at first
      //                 //                 name: name,
      //                 //                 lat: lat,
      //                 //                 lng: lng,
      //                 //                 travelListId: selectedList.id,
      //                 //                 placeId: placeId,
      //                 //                 subLevelName: 'default',
      //                 //               },
      //                 //             ],
      //                 //           }
      //                 //         : list // Keep other lists unchanged
      //                 //     )
      //                 //   );
      //               }

      //         }
      //     })
      // }
    } catch (error) {
      console.log(error);
      if (error.status === 409) {
        Alert.alert('This place has already been added to the specified list');
      }
    }

    setLocation(prevLocations => {
      const updatedLocations = [...prevLocations, currentPlace];

      return updatedLocations;
    });
  };
  return (
    <View>
      <Image
        source={{uri: `${placeDetail.photos[0]?.photoUrl}`}}
        style={[theme.card.cardImage]}
      />
      <Text style={[theme.card.cardTitle]}>{placeDetail.name}</Text>
      <Paragraph style={[theme.card.cardDetails]}>
        Rating: {placeDetail.rating}
        Total: {placeDetail.userRatingTotal}
      </Paragraph>
      <PlaceDetails
        placeId={placeDetail.placeId}
        reviews={reviews}
        setReviews={setReviews}
      />
      <AddTravelModal
        allTravelList={allTravelList}
        handleAddTrip={handleAddTrip}
      />
    </View>
  );
};

export default Place;
