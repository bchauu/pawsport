import React from 'react';
import {View, Button, Text, StyleSheet} from 'react-native';
import {useSearch} from '../../context/SearchContext';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../context/ThemeContext';

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
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: 12,
      backgroundColor: theme.colors.muted,
      borderRadius: 8,
      marginVertical: 8,
      // center contents horizontally
      alignItems: 'center',
      // subtle shadow for elevation
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    buttonContainer: {
      width: '100%',
      marginBottom: 8,
    },
    buttonColor: {
      color: theme.colors.primary, // you can change this to match your theme (forest green)
    },
    coordContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    coordText: {
      fontSize: 14,
      color: '#718096', // a muted gray
    },
  });

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
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={searchName}
          onPress={() => handleSelectSearch(searchName, lat, lon)}
          color={styles.buttonColor.color} // using a color from our style object
        />
      </View>
      <View style={styles.coordContainer}>
        <Text style={styles.coordText}>Lat: {lat}</Text>
        <Text style={styles.coordText}>Lon: {lon}</Text>
      </View>
    </View>
  );
};

export default AutoCompleteField;
