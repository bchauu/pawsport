import React from "react";
import {View, TextInput, Button, Text} from 'react-native';
import { SearchField } from "../../types/types";
import { useSearch } from "../../context/SearchContext";
import { useNavigation } from '@react-navigation/native';

type AutoCompleteFieldProps = {
    address: {}
    lat: string
    lon: string
}


const AutoCompleteField: React.FC<AutoCompleteFieldProps> = ({address, lat, lon})=> {
    const navigation = useNavigation();
    const {searchValue, setSearchValue} = useSearch(); 
    //name, city, state. country_code
    console.log(address)

    const {name, country_code, city = '', suburb = '', neighbourhood = ''} = address;

    let searchName;
    let location;
    const constructSearchName = () => {
        //construct name based on country_code
            searchName = `${name} ${city} ${neighbourhood} ${suburb} ${country_code}`
    
            searchName = searchName.replace(/\s+/g, ' ').trim();
            
        console.log(searchName);
        
    }

    constructSearchName();
  



    const handleSelectSearch = (name, lat,lng) => {

        const value = {name: name, location: {lat: lat, lng: lng}}
        setSearchValue({...searchValue, ...value});
        navigation.navigate('Home');
      }

    // const [enteredQuery, updateQuery] = props;

        //textSearch API
    return (
        <View>
            <Button title={searchName} onPress={() => handleSelectSearch(searchName, lat, lon)}/>
            <Text>{lat}</Text>
            <Text>{lon}</Text>
        </View>
    );
}

export default AutoCompleteField;