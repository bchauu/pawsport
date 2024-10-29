import React, {useState, useEffect} from "react";
import { View, Modal, Button, Text, StyleSheet, Dimensions } from "react-native";
import axios from "axios";
import useApiConfig from "../../utils/apiConfig";


const CollaboratorsModal = ({trip, hasUpdatedSharedUser, setHasUpdatedSharedUser}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const {token, apiUrl} = useApiConfig();
    const [permissedUsers, setPermissedUsers] = useState([]);


    useEffect(() => {
        const getPermissedUsers = async () => {
            if (trip) {
                try {
                    const response = await axios.get(`${apiUrl}/permissions/${trip.id}`, {
                        headers: {
                            'authorization': `Bearer ${token}`
                        }
                    })
                    console.log(response.data, 'response'
                    )
                    setPermissedUsers(response.data)
    
                } catch (error) {
                    console.log(error, 'error')
                }
            }
        }
        getPermissedUsers()
        setHasUpdatedSharedUser(false);
    }, [trip, hasUpdatedSharedUser])  //this needs to be refreshed when new user is added

    const handleRemove = async (id) => {
            console.log(id)
            // console.log(permissedUsers, 'permissedUsers')
        try {
            const response = await axios.delete(`${apiUrl}/permissions/${id}`, {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
            
            
            console.log(response, 'remove response')
            const test = permissedUsers.filter(user => user.listPermissionId != id);
            setPermissedUsers(test);
            setHasUpdatedSharedUser(true);
            console.log(test, 'test')
            console.log(permissedUsers)
            
        } catch (error) {
            console.log(error, 'error')
        }

    }
    
    return (
        <View>
            <Button title="Check Collabs" onPress={() => setModalVisible(true)} />
            <Modal
                animationType="slide"
                transparent={true}  // Set to true to allow background visibility
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}  // To allow closing the modal
            >
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        {
                            permissedUsers.length > 0 ? permissedUsers.map((user) => (
                                <View key={user.userId} style={styles.userRow}>
                                    <Text>{user.email}</Text> 
                                    <Button title="Remove" onPress={() => handleRemove(user.listPermissionId)} />
                                </View>
                            )) :
                            <View>
                                <Text>No users</Text>
                            </View>
                        }
                        <Button title="Hide" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Semi-transparent black background
    },
    container: {
        height: height / 5, 
        width: '90%',       
        backgroundColor: 'white', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,  
        padding: 20,      
    },
    userRow: {
        flexDirection: 'row',  
        justifyContent: 'center',  
        alignItems: 'center', 
        width: '100%', 
        paddingVertical: 10,  
    }
});

export default CollaboratorsModal;

//map points are not adjusting when dragged
//and last thing is to make sure this shared list can be accesed by other users