import { View, Button, TextInput, Touchable, TouchableOpacity, Text } from "react-native";
import { useState, useEffect } from "react";
import { getToken } from "../../../utils/authStorage";
import config from "../../../../src/config";
import { useTheme } from "../../../context/ThemeContext";
import axios from "axios";

const SubLevelInput = ({trip}) => {
    const [subLevelInput, setSubLevelInput] = useState('')
    const { theme } = useTheme();

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
            <TextInput 
                placeholder="Add SubLevel" 
                onChangeText={(value) => setSubLevelInput(value)} 
                value={subLevelInput}
                style={theme.textInput.default}
                />
            <TouchableOpacity
                onPress={() => addSubLevel()}
                style={[theme.actionButton.default, {width: '100%'}]}
            >
                <Text style={[theme.actionButton.text]}>
                    Add Sub-level
                </Text>
            </TouchableOpacity>

        </View>
    )
}

export default SubLevelInput;