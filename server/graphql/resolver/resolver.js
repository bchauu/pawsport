const axios = require('axios');

const root = {
  geoCode: async ({ query }) => {

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: query,
        key: process.env.GOOGLE_API_KEY
      },
    });
    return response.data.results.map(result => ({
      geometry: {
        location: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        }
      }
    }));
  }
};

module.exports = root;