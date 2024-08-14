import React from "react";
import {View, TextInput} from 'react-native';
import { SearchField } from "../../types/types";

const TypeSearch: React.FC<SearchField> = ({enteredQuery, updateQuery}) => {

//geocoding api
    return (
        <View>
            <TextInput placeholder="Restaurant, Hotel" value={enteredQuery.country} onChangeText={(value) => updateQuery("country", value)}/>
        </View>
    );
}

export default TypeSearch;