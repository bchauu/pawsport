import React, {useState, useEffect, useRef} from 'react';
import {
  TextInput,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSearch} from '../context/SearchContext';
// import AutoCompleteField from '../components/search/AutoCompleteField';
import AutoCompleteField from '../component/search/AutoCompleteField';
import config from '../config';
import {getToken} from '../utils/authStorage';
import axios from 'axios';

const SearchSuggestionScreen = () => {
  const {searchValue, setSearchValue} = useSearch(); // context --> to be accessed in search. selected from suggestions will be sent to Search
  const [suggestions, setSuggestions] = useState([]); // the suggestion to be displayed on screen
  const [locationQuery, setLocationQuery] = useState(''); // changing of query sent to api

  const [hasSuggestion, setHasSuggestion] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (locationQuery.length > 3) {
      debouncedAutoComplete();
    }
  }, [locationQuery]);

  const debouncedAutoComplete = () => {
    // Clear the previous timeout if the user is still typing
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Set a new timeout to log the value after 2 seconds of inactivity
    timeoutId.current = setTimeout(async () => {
      handleAutoComplete();
    }, 2000); // 2-second delay
  };

  const handleAutoComplete = async () => {
    const token = await getToken();

    try {
      //to backend endpoint
      // const response = await axios.post(
      //     `${config}/api/search/location`,
      //     payload);
      const {apiUrl} = await config();
      const response = await axios.post(
        `${apiUrl}/location/suggest`,
        {
          query: locationQuery,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSuggestions([...response.data.suggestions]); //suggestions to be displayed
      setHasSuggestion(true);
    } catch (error: any) {
      console.error('Error fetching autocomplete suggestions:', error.response);
      if (error.response) {
        console.log(error.response, 'response error');
      }

      if (error.request) {
        console.log(error.requeset, 'error in request');
      }
    }
  };

  const updateSuggestion = (value: string) => {
    if (value.length > 3) {
      setLocationQuery(value);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        style={styles.input}
        placeholder="Where to?"
        onChangeText={value => updateSuggestion(value)}
      />

      {hasSuggestion ? (
        <View style={styles.suggestionsContainer}>
          {suggestions?.map((suggestion, index) => (
            <AutoCompleteField
              key={index}
              address={suggestion.address}
              lat={suggestion.lat}
              lon={suggestion.lon}
              style={[
                styles.suggestionItem,
                // remove bottom border from last item, for example
                index === suggestions.length - 1 && styles.suggestionItemLast,
              ]}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.placeholderText}>Type to View Suggestions</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC', // Light neutral background
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    marginBottom: 12,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  suggestionItemLast: {
    // Remove bottom border for the last item
    borderBottomWidth: 0,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A202C',
  },
  coordText: {
    fontSize: 13,
    color: '#718096',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#A0AEC0',
    marginTop: 20,
  },
});

export default SearchSuggestionScreen;
