import React, {useState, useEffect, useRef } from 'react';
import { View, Button, TextInput, Text, ScrollView } from 'react-native';
import { useSearch } from '../context/SearchContext';
import AutoCompleteField from '../components/search/AutoCompleteField';
import config from '../config';
import { getToken } from '../utils/authStorage';
import axios from 'axios';

const SearchSuggestionScreen = () => {
  const {searchValue, setSearchValue} = useSearch();   // context --> to be accessed in search. selected from suggestions will be sent to Search
  const [suggestions, setSuggestions] = useState([]);  // the suggestion to be displayed on screen
  const [locationQuery, setLocationQuery] = useState(''); // changing of query sent to api

  const [hasSuggestion, setHasSuggestion] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (locationQuery.length > 3) {
      debouncedAutoComplete()
  }
  },[locationQuery])

  const debouncedAutoComplete = () => {
      // Clear the previous timeout if the user is still typing
      if (timeoutId.current) {
          clearTimeout(timeoutId.current);
      }

      // Set a new timeout to log the value after 2 seconds of inactivity
      timeoutId.current = setTimeout( async () => {
          handleAutoComplete();

      }, 2000); // 2-second delay
  };

  const handleAutoComplete = async () => {
    const token = await getToken();
    console.log(locationQuery)
    console.log(token)

    try {
        //to backend endpoint
                    // const response = await axios.post(
            //     `${config}/api/search/location`,
            //     payload);
            const { apiUrl } = await config();
        const response = await axios.post(`${apiUrl}/location/suggest`, 
        {
            query: locationQuery
        },
        {
            headers : {
              'Authorization': `Bearer ${token}`
            }
        }
        )
      console.log('api call being made')
      console.log(response.data, 'after api')
      setSuggestions([...response.data.suggestions])  //suggestions to be displayed
      setHasSuggestion(true);
      
    } catch (error: any) {
        console.error('Error fetching autocomplete suggestions:',error.response);
        if (error.response) {
          console.log(error.response, 'response error')
        }

        if (error.request) {
          console.log(error.requeset, 'error in request')
        }
    }
  }

  const updateSuggestion = (value: string) => {
      if (value.length > 3) {
          setLocationQuery(value);
      }
  };
  
  return (
    <ScrollView>
      <TextInput placeholder='Where to?' value={suggestions} onChangeText={(value) => (updateSuggestion(value))}/>

      { hasSuggestion ? (
        suggestions?.map((suggestion, index) => (
          <AutoCompleteField address={suggestion.address} lat={suggestion.lat} lon={suggestion.lon} key={index}></AutoCompleteField>
        ))
       ) : (
          <Text>Type to View Suggestions</Text>
        )}

    </ScrollView>
  );
};

export default SearchSuggestionScreen;
