import React from 'react';
import {View, TextInput} from 'react-native';
import {SearchField} from '../types/types';
import {useNavigation} from '@react-navigation/native';
import {useSearch} from '../context/SearchContext';
import {useTheme} from '../context/ThemeContext';

const LocationSearch: React.FC<SearchField> = ({enteredQuery, updateQuery}) => {
  const {theme} = useTheme();
  const {searchValue} = useSearch();
  const navigation = useNavigation();
  const handleNavigateToSuggest = () => {
    navigation.navigate('Suggest');
  };

  //geocoding api
  return (
    <View>
      <TextInput
        placeholder="Enter city, country (e.g., Bangkok, Thailand)"
        value={searchValue.name}
        onFocus={() => {
          handleNavigateToSuggest();
        }}
        style={[theme.textInput.default]}
      />
    </View>
  );
};

export default LocationSearch;
