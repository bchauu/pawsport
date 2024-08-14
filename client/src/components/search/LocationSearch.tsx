import React from "react";
import {View, TextInput} from 'react-native';
import { SearchField } from "../../types/types";

const LocationSearch: React.FC<SearchField> = ({enteredQuery, updateQuery}) => {

//geocoding api
    return (
        <View>
            <TextInput placeholder="Bangkok, Thailand" value={enteredQuery.location} onChangeText={(value) => updateQuery("location", value)}/>
        </View>
    );
}

export default LocationSearch;