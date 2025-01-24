import React from 'react';
import {View, Button, Text} from 'react-native';
import {useSearch} from '../context/SearchContext';
import {useNavigation} from '@react-navigation/native';

type AutoCompleteFieldProps = {
  address: {};
  lat: string;
  lon: string;
};

const AutoCompleteField: React.FC<AutoCompleteFieldProps> = ({
  address,
  lat,
  lon,
}) => {
  const navigation = useNavigation();
  const {searchValue, setSearchValue} = useSearch();
  //name, city, state. country_code

  const {
    name,
    country_code,
    city = '',
    suburb = '',
    neighbourhood = '',
  } = address;

  let searchName;
  const constructSearchName = () => {
    //construct name based on country_code
    searchName = `${name} ${city} ${neighbourhood} ${suburb} ${country_code}`;

    searchName = searchName.replace(/\s+/g, ' ').trim();
  };

  constructSearchName();

  const handleSelectSearch = (name, lat, lng) => {
    const value = {name: name, location: {lat: lat, lng: lng}};
    setSearchValue({...searchValue, ...value});
    navigation.navigate('Home');
  };

  // const [enteredQuery, updateQuery] = props;

  //textSearch API
  return (
    <View>
      <Button
        title={searchName}
        onPress={() => handleSelectSearch(searchName, lat, lon)}
      />
      <Text>{lat}</Text>
      <Text>{lon}</Text>
    </View>
  );
};

export default AutoCompleteField;
