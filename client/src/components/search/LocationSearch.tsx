import React from "react";
import {View, TextInput} from 'react-native';
import { SearchField } from "../../types/types";
import { useNavigation } from "@react-navigation/native";
import { useSearch } from "../../context/SearchContext";

const LocationSearch: React.FC<SearchField> = ({enteredQuery, updateQuery}) => {
    const {searchValue} = useSearch();
    const navigation = useNavigation();
    const handleNavigateToSuggest = () => {
        navigation.navigate('Suggest');
    }

//geocoding api
    return (
        <View>
            <TextInput 
                placeholder="Bangkok, Thailand" 
                value={searchValue.name} 
                onFocus={() => {handleNavigateToSuggest()}}
            />
        </View>
    );
}

export default LocationSearch;