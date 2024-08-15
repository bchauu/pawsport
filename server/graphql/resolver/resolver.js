const axios = require('axios');

const getGeocode = async (query) => {
  const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
          address: query,
          key: process.env.GOOGLE_API_KEY
      }
  });

  if (response.data.results.length === 0) {
      throw new Error('No results found for the provided address');
  }

  const location = response.data.results[0].geometry.location;
  return location;
};

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
  searchPlaces: async ({ query, radius, type, nextPageToken }) => {
      try {
        console.log(nextPageToken, 'token');
          if (nextPageToken) {
            const {results, next_page_token} = await getNextPage(nextPageToken);
            console.log(results, 'result from next token');

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
                  types: place.types,
                  user_ratings_total: place.user_ratings_total,
                  photos: photos
              };
          }));

          const filteredPlaces = places.filter(place => place.user_ratings_total > 10);
            return { result: filteredPlaces, next_page_token: next_page_token };
          }
          
          // Get location from geocode
          const location = await getGeocode(query);

          // Get nearby places
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
                  user_ratings_total: place.user_ratings_total,
                  photos: photos
              };
          }));

          const filteredPlaces = places.filter(place => place.user_ratings_total > 10);
          // console.log(filteredPlaces[0].user_ratings_total, 'first total rating');
          console.log(next_page_token, 'token before clicking next')
          
          return { result: filteredPlaces, next_page_token: next_page_token };
      } catch (error) {
          console.error("Error in searchPlaces resolver:", error.message);
          throw new Error('Error fetching places');
      }
  }
};


module.exports = resolver;