import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Button,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import LocationSearch from '../search/LocationSearch';
import ButtonSlider from '../search/TypeButton';
import Place from '../places/Place';
import List from '../places/List';
import {useSearch} from '../../context/SearchContext';
import {useTrip} from '../../context/TripContext';
import DirectSearchPlace from '../places/DirectSearchPlace';
import SearchOptions from '../search/SearchOptions';
import {useTheme} from '../../context/ThemeContext';
import useApiConfig from '../../utils/apiConfig';

type EnteredQuery = {
  Location: {};
  type: string;
};

interface Place {
  business_status: string | null;
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  photos: {
    height: number;
    photo_reference: string;
    width: number;
    photoUrl: string;
  };
  place_id: string;
  rating: number;
  types: string[];
  user_ratings_total: number | null;
}

const Search = () => {
  const {theme} = useTheme();
  const {locations, setLocation} = useTrip();
  const {token, apiUrl} = useApiConfig();
  const [isSearchInitiated, setIsSearchInitiated] = useState(false);
  const [directSearchResult, setDirectSearchResult] = useState([]);
  const [selectedSearchOption, setSelectedSearchOption] =
    useState('findNearby');
  const {searchValue} = useSearch();

  const [enteredQuery, setEnteredQuery] = useState({
    location: {
      lat: '',
      lng: '',
    },
    type: '',
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [nextPage, setNextPage] = useState<String>('');
  const [googleMapUrl, setGoogleMapUrl] = useState('');

  const updateQuery = (
    searchName: keyof EnteredQuery | string,
    query: string,
  ) => {
    setEnteredQuery(prevState => ({
      ...prevState,
      [searchName]: query,
    }));
  };

  useEffect(() => {}, []);

  const handleSubmit = async () => {
    try {
      const {location, type} = searchValue;
      const response = await axios.post(
        `${apiUrl}/graphql`,
        {
          query: `query {
                        searchPlaces(location: {lat: ${location.lat}, lng: ${location.lng}}, type: "${type}", radius: 4500) {
                                result {
                                    name
                                    location {
                                        lat
                                        lng
                                    }
                                    businessStatus
                                    address
                                    placeId
                                    rating
                                    vicinity
                                    types
                                    userRatingTotal
                                    photos {
                                        height
                                        photoReference
                                        width
                                        photoUrl
                                    }
                                }
                                next_page_token
                        }
                        
                    }`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data.data.searchPlaces.result, 'handleSubmit');
      // should display message to user if it returns empty
      setPlaces([...response.data.data.searchPlaces.result]);
      setNextPage(response.data.data.searchPlaces.next_page_token);
      setIsSearchInitiated(true);
      setLocation([]);
    } catch (error: any) {
      if (error.response.data.error === 'Token expired') {
        console.log(error.error, 'new token needed');
      } else {
      }
    }
  };

  const handleNextPage = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/graphql`,
        {
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
                        
                    }`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPlaces([...response.data.data.searchPlaces.result]);
      setNextPage(response.data.data.searchPlaces.next_page_token);
      setIsSearchInitiated(true);
      setLocation([]);
    } catch (error: any) {
      if (error.response.data.error === 'Token expired') {
        console.log(error.error, 'new token needed');
      } else {
        console.log(error.response.data, 'sending search request');
      }
    }
  };

  const handleGoogleUrl = url => {
    console.log(url, 'handleGoogleUrl');
    setGoogleMapUrl(url);
  };

  const submitGoogleUrl = async () => {
    // const token = await getToken();
    //https://maps.app.goo.gl/1MqRkAnThoXY2eqbA?g_st=com.google.maps.preview.copy`  to test
    // https://maps.app.goo.gl/DQHkLhNGJ2Y5zDer8    --> for desktop. seems to give full details
    //need to be handled differently
    //resolveAndExtractPlace(url: "${googleMapUrl}") {
    try {
      const response = await axios.post(
        `${apiUrl}/graphql`,
        {
          query: `query {
                        resolveAndExtractPlace(url: "https://maps.app.goo.gl/DQHkLhNGJ2Y5zDer8") {
                                result {
                                    name
                                    location {
                                        lat
                                        lng
                                    }
                                    businessStatus
                                    address
                                    placeId
                                    rating
                                    vicinity
                                    types
                                    userRatingTotal
                                    photos {
                                        height
                                        photoReference
                                        width
                                        photoUrl
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
      console.log(response.data.data.resolveAndExtractPlace, 'handleGoogleUrl');
      setDirectSearchResult(response.data.data.resolveAndExtractPlace.result);
    } catch (error: any) {
      if (error.response.data.error === 'Token expired') {
        console.log(error.error, 'new token needed');
      } else {
        console.log(error, 'not working');
      }
    }
  };

  return (
    <View style={[styles.searchContainer]}>
      <SearchOptions
        selectedSearchOption={selectedSearchOption}
        setSelectedSearchOption={setSelectedSearchOption}
      />
      {selectedSearchOption === 'googleMapsLink' ? (
        <View>
          <TextInput
            placeholder="Paste a location’s Google Maps link"
            onChangeText={value => handleGoogleUrl(value)}
            value={googleMapUrl}
            style={[theme.inputs.default]}
          />
          <View style={[theme.spacing.padding.default]} />
          <DirectSearchPlace
            directSearchResult={directSearchResult}
            submitGoogleUrl={submitGoogleUrl}
          />
        </View>
      ) : (
        selectedSearchOption === 'findNearby' && (
          <View>
            <LocationSearch
              enteredQuery={enteredQuery}
              updateQuery={updateQuery}
            />
            <ButtonSlider
              enteredQuery={enteredQuery}
              updateQuery={updateQuery}
            />
            <List
              places={places}
              setIsSearchInitiated={setIsSearchInitiated}
              isSearchInitiated={isSearchInitiated}
            />
            <View style={theme.spacing.padding.default}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  ...theme.buttons.cta,
                  ...styles.buttonContainer,
                  backgroundColor: theme.colors.secondary,
                }}>
                <Text style={[theme.buttons.ctaText]}>Search Location</Text>
              </TouchableOpacity>
            </View>
            {nextPage ? (
              <Button title="next:" onPress={handleNextPage} />
            ) : (
              <></>
            )}
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'column',
    width: '95%',
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
    width: '33%',
    alignSelf: 'flex-end',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

export default Search;
