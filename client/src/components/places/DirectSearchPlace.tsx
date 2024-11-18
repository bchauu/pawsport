import React, {useState, useEffect} from "react";
import { View, Modal, Button, Text, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { Paragraph } from 'react-native-paper';
import useApiConfig from "../../utils/apiConfig";
import { Card } from 'react-native-paper';
import axios from "axios";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const DirectSearchPlace = ({directSearchResult}) => {
    const {token, apiUrl} = useApiConfig();
    const [modalVisible, setModalVisible] = useState(false);

    const handleGoogleUrl = () => {
        setModalVisible(true)
        console.log('modal should show up')
    }

    useEffect(() => {
        console.log(directSearchResult[0])
    }, [directSearchResult])

    
    return (
        <View>
            <Button title="Search from Google Link" onPress={() =>handleGoogleUrl()} />
            <Modal
                animationType="slide"
                transparent={true}  // Set to true to allow background visibility
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}  // To allow closing the modal

                //only need one review of each pace
                    // match placeId of review state

            >
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <Text>Is this the One?</Text>
                        {directSearchResult &&
                            <ScrollView horizontal>
                                <Card>
                                    {
                                    directSearchResult.map((item, index) => (
                                        <View>

                                        <Card.Content>
                                            <Text key={index}>{item.name}</Text>
                                        </Card.Content>
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
                                    {/* <Card.Content>
                                    <Paragraph>
                                        Rating: {item.rating}
                                        Total: {placeDetail.user_ratings_total}
                                    </Paragraph>
                                    </Card.Content> */}
                                </Card>
                            </ScrollView>

                        }
                        {/* {reviews && //all data is here. just put it in a horizontal list with within a card component
                            <ScrollView horizontal>
                            {reviews[placeId]?.map((review) => (
                                    //write helper function to transform review.text to all be same format
                                <Card style={styles.reviewCard}>
                                    <Card.Content style={styles.reviewHeader}>
                                        <Text>{review.author}</Text>
                                        <Text>{review.rating}</Text>
                                        <Text>{review.relativeTimeDescription}</Text>
                                    </Card.Content>
                                    <Card.Content >
                                        <ScrollView>
                                        <Text>{review.text}</Text>
                                        </ScrollView>
                                    </Card.Content>
                                </Card>
   
                            ))}
                            </ScrollView>
           

                        } */}
                        <View>

                        </View>
                        {/* <Button title={"test"} onPress={() =>handleTest() }></Button> */}
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