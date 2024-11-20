import { View, Button, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { getToken } from "../../../utils/authStorage";
import config from "../../../../src/config";
import axios from "axios";

const SubLevelInput = ({trip}) => {
    const [subLevelInput, setSubLevelInput] = useState('')

    const addSubLevel = async () => {
        console.log(subLevelInput, 'subLevelInput')
        console.log(trip.id, 'trip.id')
        setSubLevelInput('');
        try {
            const token = await getToken();
                const { apiUrl } = await config();
            const response = await axios.post(`${apiUrl}/trips/lists/addSubLevel`, 
            {
                name: subLevelInput,
                travelListId: trip.id
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            }
            )

            console.log(response, 'response from posting sublevels')

        } catch (error) {
            console.log(error, 'errror in posting sublevels')
        }
    }

    return (
        <View>
            <TextInput placeholder="Add SubLevel" onChangeText={(value) => setSubLevelInput(value)} value={subLevelInput}></TextInput>
            <Button title="addSubLevel" onPress={() => addSubLevel()}></Button>
        </View>
    )
}

export default SubLevelInput;