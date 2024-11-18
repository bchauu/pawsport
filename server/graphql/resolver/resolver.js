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


const extractQueryFromUrl = async (url) => {
  const urlObj = new URL(url);
  const query = urlObj.searchParams.get('q'); // Get the "q" parameter
  if (!query) {
      throw new Error('No "q" parameter found in URL');
  }
  return query;
}

// Step 2: Use Geocoding API to get coordinates and Place ID
const getCoordinatesAndPlaceId = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.GOOGLE_API_KEY
      }
    })
    const results = response.data.results;

    if (results.length === 0) {
      throw new Error('No results found for the provided query');
  }

    const {lat, lng} = results[0].geometry.location;
    const location = `${lat},${lng}`;
    return { location, address };

    
  } catch (error) {
    console.log(error, 'error in getting coordinates')
  }
}

const resolveUrl = async (url) => {
    //redirect
    try {
      const response = await axios.get(url, {
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 400
      })

      if (response.status === 301 || response.status === 302) {
        const fullUrl = response.headers.location;
        const address = await extractQueryFromUrl(fullUrl)
        return await getCoordinatesAndPlaceId(address);
      }

    } catch (error) {
      console.log(error, 'error in resolving url')
    }
}

const getTextSearch = async (location, address) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query: address,
          location: location,
          radius: 100,
          key: process.env.GOOGLE_API_KEY
        }
      })
      return response.data;

    } catch (error) {
      console.log(error, 'error in calling textSearch from google maps')
    }
}

const filteredResults = async (results) => {
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
        address: place.formatted_address,
        rating: place.rating,
        types: place.types,
        vicinity: place.vicinity,
        user_ratings_total: place.user_ratings_total,
        photos: photos
    };
  }));

  const filteredPlaces = places.filter(place => place.user_ratings_total > 10);

  return filteredPlaces;
}

const resolver = {
  searchPlaces: async ({ location, radius, type, nextPageToken }) => {
      try {
          if (nextPageToken) {
            const {results, next_page_token} = await getNextPage(nextPageToken);

            const resultPlaces = await filteredResults(results);
            return {result: resultPlaces, next_page_token: next_page_token }

          }

          const { results, next_page_token } = await getNearbyPlaces(location, radius, type);


          const resultPlaces = await filteredResults(results);
          console.log(resultPlaces, 'Places')
          return {result: resultPlaces, next_page_token: next_page_token }
     
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
  },

  resolveAndExtractPlace: async ({url}) => {
    const {location, address} = await resolveUrl(url);
    const {results} = await getTextSearch(location, address);
    const resultPlaces = await filteredResults(results);
    return {result: resultPlaces}
      
  }

};


module.exports = resolver;