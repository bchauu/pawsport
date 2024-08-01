import React from "react";
import {View, TextInput } from 'react-native';
import { SearchField } from "../../types/types";

const DescriptionSearch: React.FC<SearchField> = ({enteredQuery, updateQuery})=> {

    // const [enteredQuery, updateQuery] = props;

        //textSearch API
    return (
        <View>
            <TextInput placeholder="Restaurant" value={enteredQuery.description} onChangeText={value => updateQuery("description", value)}/>
        </View>
    );
}

export default DescriptionSearch;