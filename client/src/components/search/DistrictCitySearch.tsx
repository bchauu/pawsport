import React from "react";
import {View, TextInput} from 'react-native';
import { SearchField } from "../../types/types";

const DistrictCitySearch: React.FC<SearchField> = ({enteredQuery, updateQuery}) => {

//geocoding api
    return (
        <View>
            <TextInput placeholder="Chinatown, Bangkok" value={enteredQuery.districtCity.join(',')} onChangeText={(value) => updateQuery("districtCity", value)}/>
        </View>
    );
}

export default DistrictCitySearch;