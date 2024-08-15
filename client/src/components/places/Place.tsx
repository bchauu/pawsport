import React from "react";
import { View, Text,Image, ScrollView} from "react-native";
import { Paragraph } from 'react-native-paper';

const Place = ({placeDetail}) => {
    console.log(placeDetail.photos[0]?.photoUrl, 'place component')
    return (
        <View
        >
            <Image
                source={{ uri: `${placeDetail.photos[0]?.photoUrl}` }}
                style={{width: 100, height: 100}}
            />
            <Text>
                {placeDetail.name}
            </Text>
            <Paragraph>
                Rating: {placeDetail.rating}
                Total: {placeDetail.user_ratings_total}
            </Paragraph>
            <Paragraph>
                View more:
            </Paragraph>
        </View>
    )
}

export default Place;