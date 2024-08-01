import React from "react";
import {View, TextInput} from 'react-native';
import { SearchField } from "../../types/types";

const CountrySearch: React.FC<SearchField> = ({enteredQuery, updateQuery}) => {

//geocoding api
    return (
        <View>
            <TextInput placeholder="Thailand" value={enteredQuery.country} onChangeText={(value) => updateQuery("country", value)}/>
        </View>
    );
}

export default CountrySearch;