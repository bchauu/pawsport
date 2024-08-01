const axios = require('axios');

const root = {
  searchPlaces: async ({ query }, req) => {
    console.log(req, 'resolver');
    // const user = req.user;
    // console.log('Authenticated user:', user);

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: query,
        key: process.env.GOOGLE_API_KEY,
      },
    });
    return response.data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      types: place.types,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
    }));
  },
  getPlaceById: async ({ id }, req) => {
    console.log(req, 'resolver');
    // const user = req.user;
    // console.log('Authenticated user:', user);

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: id,
        key: process.env.GOOGLE_API_KEY,
      },
    });
    const place = response.data.result;
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      types: place.types,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
    };
  },
};

module.exports = root;