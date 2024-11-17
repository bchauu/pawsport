const axios = require('axios');

const getNearbyPlaces = async (location, radius, type) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
          location: `${location.lat},${location.lng}`,
          radius: radius,
          rankby: 'prominence',
          type: type,
          key: process.env.GOOGLE_API_KEY
      }
  });

  return response.data;
};

const getAllReviews = async (placeId) => {
  console.log('getPaceReviews')

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'reviews',
        key: process.env.GOOGLE_API_KEY
      }
    })
    console.log(response.data.result, 'getPlaceReviews')
    return response.data.result;
  } catch (error) {
    console.error('Error fetching place reviews:', error.message);
  }

}


const getPhotoUrl = async (photoReference) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/photo', {
      params: {
        maxwidth: 400, 
        photoreference: photoReference,
        key: process.env.GOOGLE_API_KEY
      },
      maxRedirects: 0, // prevent axios from following the redirect automatically
      validateStatus: function (status) {
        return status >= 300 && status < 400; // resolve only if the status code is in the range of 3xx
      }
    });

    return response.headers.location;
  } catch (error) {
    console.error('Error fetching photo URL:', error);
    return null;
  }
};

const getNextPage = async (token) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${process.env.GOOGLE_API_KEY}`, {
    params: {
      pagetoken: token,
      rankby: 'prominence',
      key: process.env.GOOGLE_API_KEY
    }
  });
  return response.data;
}

const resolver = {
  searchPlaces: async ({ location, radius, type, nextPageToken }) => {
      try {
          if (nextPageToken) {
            const {results, next_page_token} = await getNextPage(nextPageToken);

            const places = await Promise.all(results.map(async place => {
              
              const photos = place.photos ? await Promise.all(place.photos.map(async photo => ({
                  height: photo.height,
                  photo_reference: photo.photo_reference,
                  width: photo.width,
                  photoUrl: getPhotoUrl(photo.photo_reference)
              }))) : [];

              return {
                  name: place.name,
                  location: {
                      lat: place.geometry.location.lat,
                      lng: place.geometry.location.lng
                  },
                  business_status: place.business_status,
                  place_id: place.place_id,
                  rating: place.rating,
                  price_level: place.price_level,
                  vicinity: place.vicinity,
                  types: place.types,
                  user_ratings_total: place.user_ratings_total,
                  photos: photos
              };
          }));

          const filteredPlaces = places.filter(place => place.user_ratings_total > 10);
            return { result: filteredPlaces, next_page_token: next_page_token };
          }

          const { results, next_page_token } = await getNearbyPlaces(location, radius, type);

          const places = await Promise.all(results.map(async place => {
              
              const photos = place.photos ? await Promise.all(place.photos.map(async photo => ({
                  height: photo.height,
                  photo_reference: photo.photo_reference,
                  width: photo.width,
                  photoUrl: getPhotoUrl(photo.photo_reference)
              }))) : [];

              return {
                  name: place.name,
                  location: {
                      lat: place.geometry.location.lat,
                      lng: place.geometry.location.lng
                  },
                  business_status: place.business_status,
                  place_id: place.place_id,
                  rating: place.rating,
                  types: place.types,
                  vicinity: place.vicinity,
                  user_ratings_total: place.user_ratings_total,
                  photos: photos
              };
          }));

          const filteredPlaces = places.filter(place => place.user_ratings_total > 10);
          
          return { result: filteredPlaces, next_page_token: next_page_token };
      } catch (error) {
          console.error("Error in searchPlaces resolver:", error.message);
          throw new Error('Error fetching places');
      }
  },

  getPlaceReviews: async ({ placeId }) => {
    try {
      const placeDetails = await getAllReviews(placeId);
        console.log(placeDetails.reviews[0], 'placeDetails')
        const test = {         reviews: placeDetails.reviews.map((review) => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          relativeTimeDescription: review.relative_time_description,
        }))}

        console.log(test, 'test placeDetails')
      return {
          reviews: placeDetails.reviews.map((review) => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          relativeTimeDescription: review.relative_time_description,
        }))
      };
    } catch (error) {
      console.error('Error in resolver:', error.message);
      throw new Error('Failed to fetch place reviews');
    }
  }

};


module.exports = resolver;