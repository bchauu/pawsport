import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  Button,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import useApiConfig from '../../utils/apiConfig';
import {Card} from 'react-native-paper';
import axios from 'axios';
import {useTheme} from '../../context/ThemeContext';
import getReviewApi from '../../utils/reviewApi';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaceDetails = ({placeId, reviews, setReviews}) => {
  const {theme} = useTheme();
  const {token, apiUrl} = useApiConfig();
  const [modalVisible, setModalVisible] = useState(false);

  //https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4
  //this format to open up on google maps --> this way they can get even more info if needed

  const handleViewDetails = async () => {
    console.log(placeId, 'placeId');
    try {
      const response = await getReviewApi({placeId, apiUrl, setReviews});

      setReviews(prevReviews => ({
        ...prevReviews,
        [placeId]: response,
      }));

      setModalVisible(true);
    } catch (error) {
      console.log(error, 'error in fetching reviews');
    }
    setModalVisible(true);
  };

  const handleTest = () => {
    console.log(reviews, 'review state');
  };

  return (
    <View style={theme.lists.buttonsContainer}>
      <TouchableOpacity
        onPress={() => handleViewDetails()}
        style={{marginTop: -18}}>
        <Icon name="info" size={24} color="#7F5B34" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true} // Set to true to allow background visibility
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // To allow closing the modal
      >
        <View style={styles.modalBackground}>
          <View style={styles.container}>
            <Text>Reviews</Text>
            {reviews && (
              <ScrollView horizontal>
                {reviews[placeId]?.map((review, index) => (
                  <Card key={index} style={theme.lists.reviewCard}>
                    <Card.Content>
                      <ScrollView style={theme.lists.verticalScroll}>
                        <View style={theme.lists.reviewHeaderContainer}>
                          <Text style={theme.lists.authorText}>
                            {review.author}
                          </Text>
                          <Text style={theme.lists.ratingText}>
                            Review: {review.rating}/5
                          </Text>
                          <Text style={theme.lists.relativeTimeText}>
                            {review.relativeTimeDescription}
                          </Text>
                        </View>
                        <Text style={theme.lists.reviewText}>
                          {review.text}
                        </Text>
                      </ScrollView>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>
            )}
            <View />
            {/* <Button title={'test'} onPress={() => handleTest()} /> */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Hide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  container: {
    height: height / 2,
    width: '90%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
  },
});

export default PlaceDetails;

//map points are not adjusting when dragged
//and last thing is to make sure this shared list can be accesed by other users
