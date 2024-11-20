import { TouchableOpacity, Text, View } from "react-native";
import {useState, useEffect} from 'react';
import axios from "axios";
import { getToken } from "../../../utils/authStorage";
import config from "../../../../src/config";

const RemoveSubLevel = ({subLevel, setSubLevels}) => {
    // const [refreshSubLevel, setRefreshSubLevel] = useState(false)

    const handleRemoveSubLevel = async () => {

            try {
                const token = await getToken();
                const { apiUrl } = await config();
                const response = await axios.delete(`${apiUrl}/trips/lists/deleteSubLevel`,
                {
                    data: {
                      id: subLevel.id
                    }
                  ,
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                })

                //filter out this sublevel
                setSubLevels((prevValue) => prevValue.filter((name) => name.id !== subLevel.id))
                // refreshSubLevel 
    
                console.log(response, 'response from posting sublevels')
            } catch (error) {
                console.log(error, 'error in deleting sub level')
            }
    }

    return (
        <View>
            <TouchableOpacity
                onPress={handleRemoveSubLevel}
            >
            <Text>Remove Sub-level</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RemoveSubLevel;