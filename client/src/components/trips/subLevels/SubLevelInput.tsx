import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import useApiConfig from "../../../utils/apiConfig";
import axios from "axios";

const SubLevelInput = ({trip}) => {
    const [subLevelInput, setSubLevelInput] = useState('')
    const { theme } = useTheme();
    const {token, apiUrl} = useApiConfig();

    const addSubLevel = async () => {

        setSubLevelInput('');
        try {
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