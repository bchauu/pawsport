import { View } from "react-native";
import axios from "axios";
import ConfirmationModal from "../../../components/sharedModals/ConfirmationModal";
import useApiConfig from "../../../utils/apiConfig";
import { useTheme } from "../../../context/ThemeContext";

const RemoveSubLevel = ({changeItemCategory, subLevel, setSubLevels}) => {
    const { theme } = useTheme();
    const {token, apiUrl} = useApiConfig();

    const handleRemoveSubLevel = async () => {
            try {
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

                console.log(response, 'response')

                //filter out this sublevel
                setSubLevels((prevValue) => prevValue.filter((name) => name.id !== subLevel.id))
                console.log('does this get called')
  
                // changeItemCategory(subLevel);    
                    //future feature
            } catch (error) {
                console.log(error, 'error in deleting sub level')
            }
    }

    return (
        <View>
            <ConfirmationModal handleConfirmation={handleRemoveSubLevel}></ConfirmationModal>
        </View>
    )
}



export default RemoveSubLevel;