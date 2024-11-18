import React, {useState, useEffect} from "react";
import { View, Modal, Button, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import useApiConfig from "../../utils/apiConfig";
import { Card } from 'react-native-paper';
import ListSelector from "./BottomSheet";
import axios from "axios";

const DirectSearchPlace = ({directSearchResult}) => {
    const {token, apiUrl} = useApiConfig();
    console.log(token, apiUrl, 'test')
    const [modalVisible, setModalVisible] = useState(false);
    const [isBottomVisible, setIsBottomVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');


    const [allTravelList, setAllTravelList] = useState([]);

    useEffect(() => {

        if (token && apiUrl) {
            try {
                const getList = async () => {
                    const response = await axios.get(`${apiUrl}/trips/lists/places`, {
                        headers: {
                          'authorization': `Bearer ${token}`
                        }
                    });
        
                    console.log(response.data.travelLists, 'directSearch')
        
                    setAllTravelList([...response.data.travelLists])
        
                }
                getList();
            } catch (error) {
                console.log(error, 'error in direct')
                console.error('Error fetching travel lists:', error.message);
                if (error.response) {
                    console.error('Response error:', error.response);
                } else if (error.request) {
                    console.error('Request error:', error.request);
                } else {
                    console.error('Other error:', error);
                }
            }
        }
      }, [token, apiUrl])      

    const handleGoogleUrl = () => {
        setModalVisible(true)
        console.log('modal should show up')
    }

    useEffect(() => {
        console.log(directSearchResult[0])
    }, [directSearchResult])

    const handleAddDirectToList = (item) => {
        console.log(item.place_id, 'handleAddDirectToList')
        setSelectedItem(item);
        setIsBottomVisible(true)
    }

    
    return (
        <View>
            <Button title="Search from Google Link" onPress={() =>handleGoogleUrl()} />
            <Modal
                animationType="slide"
                transparent={true}  // Set to true to allow background visibility
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}  // To allow closing the modal
            >
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <Text>Is this the One?</Text>
                        
                        {
                        isBottomVisible && 
                        <ListSelector 
                            allTravelList={allTravelList}
                            selectedItem={selectedItem}
                            isBottomVisible={isBottomVisible}
                            setIsBottomVisible={setIsBottomVisible}
                        >
                        </ListSelector>
                        
                        }
                        {directSearchResult &&
                            <ScrollView horizontal>
                                <Card>
                                    {
                                    directSearchResult.map((item) => (
                                        
                                        <View  key={item.place_id}>
                                        <View>
                                            <Button title="Add to List" onPress={() => handleAddDirectToList(item)} />
                                        </View>
                                        <Card.Content>
                                            <Text>Rating: {item.rating}</Text>
                                            <Text>Total: {item.user_ratings_total}</Text>
                                            <Text>Address: {item.address}</Text>
                                            <Image
                                                source={{ uri: `${item.photos[0]?.photoUrl}` }}
                                                style={{width: 100, height: 100}}
                                            />
                                        </Card.Content>
                                        </View>
                                        
                                        ))
                                    }
                                </Card>
                            </ScrollView>
                        }
                        <View>
                        </View>
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
        height: height / 2, 
        // flexGrow: 1,
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
    },
    reviewText: {
        height: '100%',
        width: '20%'
    },
    reviewHeader: {
        paddingBottom: 10,
        borderColor: 'black'
    },
    reviewCard: {
        // width: '30%',
        // flexGrow: 1,
        alignSelf: 'flex-start',
        maxWidth: 350,
        // height: 300,
        // maxHeight: 1000
    }
});

export default DirectSearchPlace;

//map points are not adjusting when dragged
//and last thing is to make sure this shared list can be accesed by other users