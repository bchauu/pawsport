const axios = require('axios');
const { TravelList, TravelItems, ListPermission, ItemNotes, TravelListSubLevels, PlaceDetails, PlaceReview } = require('../../models');

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
    //findOne if doesnt exist then do api
    // const foundPlaceReview = await PlaceReview.findOne({where: {place_id: placeId}});

    // if (foundPlaceReview) return foundPlaceReview;

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'reviews',
        key: process.env.GOOGLE_API_KEY
      }
    })

    // const {
    //   author_name, 
    //   author_url, 
    //   language, 
    //   original_language, 
    //   rating, 
    //   relative_time_description, 
    //   text, 
    //   translated
    // } = response.data.result;

    // PlaceReview.create({
    //   placeId,
    //   language,
    //   rating,
    //   text,
    //   translated,
    //   originalLanguage: original_language,
    //   relativeTimeDescription: relative_time_description,
    //   authorName: author_name,
    //   authorUrl: author_url, 
    // })
      //cuz its an array. leave out for now

    //if response exist, then create data row
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
  console.log(results, 'passed into filteredResults')
  const {reviews} = results[0];
  const places = await Promise.all(results.map(async place => {
              
    // const photos = place.photos ? await Promise.all(place.photos.map(async photo => ({
    //     height: photo.height,
    //     photo_reference: photo.photo_reference,
    //     width: photo.width,
    //     photoUrl: await getPhotoUrl(photo.photo_reference)
    // }))) : [];


    const photos = place.photos
      ? await Promise.all(
          place.photos.map(async (photo, index) => {
            // Add delay to avoid hitting rate limits
            if (index > 0) {
              await delay(200); // Adjust delay based on your API rate limit
            }

            return {
              height: photo.height,
              photoReference: photo.photo_reference,
              width: photo.width,
              photoUrl: await getPhotoUrl(photo.photo_reference), // Fetch the photo URL
            };
          })
        )
      : [];

        return {
            name: place.name,
            location: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
            },
            businessStatus: place.business_status,
            placeId: place.place_id,
            address: place.formatted_address,
            rating: place.rating,
            types: place.types,
            vicinity: place.vicinity,
            userRatingTotal: place.user_ratings_total,
            photos: photos
        };
      }));
    // console.log(places, 'after mapping through')
    // console.log(reviews, 'reviews from results')
      //good but lost reviews

      const filteredPlaces = places.filter(
        place => place.userRatingTotal === undefined || place.userRatingTotal > 10
      );
    
    console.log(filteredPlaces, 'this should not be empty from getting photos')
      //this works now cuz user rating is not undefined
  return filteredPlaces;
}

const getPlaceWithPlaceId = async (placeId) => {
  // https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJfUpAzTqsQjQRwQl6ORhwbV0&key=AIzaSyAEEHT0dHSKuklxdI-L7q8byjZnG24-Quw
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_API_KEY
      }
    })

    console.log(response, 'getting each place detail')
  } catch (error) {
    console.log(error, 'error in placeId')
  }
}

const checkforReview = async (placeId, reviews) => {
  try {
    // Check if any reviews already exist for the place
    const existingReviews = await PlaceReview.findOne({ where: { place_id: placeId } });

    if (!existingReviews) {
      // Only proceed if reviews exist in the API response
      if (reviews && reviews.length > 0) {
        // Bulk insert all reviews for better performance
        await PlaceReview.bulkCreate(
          reviews.map((review) => ({
            place_id: placeId,
            author_name: review.author_name,
            language: review.language,
            original_language: review.original_language,
            rating: review.rating,
            relative_time_description: review.relative_time_description,
            text: review.text,
            time: review.time,
            translated: review.translated,
          }))
        );
        console.log('Reviews successfully saved to database.');
      } else {
        console.log('No reviews found in API response.');
      }
    } else {
      console.log(`Reviews for placeId ${placeId} already exist in the database.`);
    }
  } catch (error) {
    console.error('Error checking or saving reviews:', error.message);
  }
};

  //this should be called within a map to get each
const getSpecificPlaceWithReview = async (placeId) => {
    //issue here as we map through each

  console.log(placeId, 'within getSpecificPlaceWithReview')
  try {
    const placeDetails = await PlaceDetails.findOne({where: {place_id: placeId}})
    if (!placeDetails) {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_API_KEY
        }
      })
  
      // const {reviews} = response.data.result;
      //   //undefined 
      // console.log(response.data.result, 'review from response')

      // checkforReview(placeId, reviews);
  
      const places = await filteredResults([response.data.result])    //this gets all in right format. including photo
      // places[0].reviews = reviews;

          //placeDetails dont match results
      console.log(places, 'places after adding reviews')
        //photoreference is not extrapolated here
      console.log(places[0].photos[0], 'photos after filtered')

      // {
      //   height: 2268,
      //   photo_reference: 'AdDdOWrNxsqYbXUDJpNvug8PJSfjA902SDLFeW8mOeBBqNRi2_R4qBSmUASqa6xhaYWtIXG9h47l4v-d50-3eixCN3spf7v4ofpjqDUahmbPxHikE7UPFv4ZiR6w7dwDaJSQzP0xUB_ruWJSkvOLJVTJKyCayH77DoXziBePKy8CoGBNdeey',
      //   width: 4032,
      //   photoUrl: 'https://lh3.googleusercontent.com/places/ANXAkqFa2TBW-vMU-1ZaOfQnN8gRY84aNRfbFabwDlyRETRUNklhglbYyuIlOs2xhwQFNANCgo8QS3FSnBTO6yl_C3JyymwhELM9X0M=s1600-w400'
      // } photos after filtered
        //need it in this format
          //database needs to reflect this as well
            //so jsonb again instead of string


     const newPlaceDetails = await PlaceDetails.create(
      { placeId: places[0].placeId, 
        name: places[0].name, 
        address: places[0].address, 
        rating: places[0].rating, 
        location: places[0].location,
        businessStatus: places[0].businessStatus,
        types: places[0].types,
        userRatingTotal: places[0].userRatingTotal,
        vicinity: places[0].vicinity,
        photos: places[0].photos

      })

      // type Result {
      //   name: String     check
      //   location: Location   WRong Format
      //   business_status: String
      //   place_id: String     check
      //   address: String      check
      //   rating: Float        check
      //   types: [String]  
      //   user_ratings_total: String
      //   photos: [PhotoAtt]
      //   rankby: String
      //   price_level: Int
      //   vicinity: String
      // }

      return places;  //this is returning with review, but my schema for this particular query has no review
    }

    console.log(placeDetails.dataValues, 'placeWithReviews')
    return placeDetails.dataValues;

  } catch (error) {
    console.log(error, 'error in placeId')
  }
}


const getRecommendedList = async (userId) => {
  const allRecommended = await TravelList.findAll({
    where: {userId: 6},
    include: [
      {
        model: TravelItems,
        as: 'items', 
      },
      {
        model: TravelListSubLevels, 
        as: 'subLevels'
      }
    ]
  })

  const filteredRecommneded = allRecommended.map((list) => (
    // list.filter((data) => data.dataValues === dataValues)
    list.dataValues
  ))

  console.log(filteredRecommneded, 'filteredRecommneded')
  return filteredRecommneded;



  // // console.log(allRecommended, 'allRecommended');
  // console.log(filteredRecommneded[0].items, 'filteredRecommneded')
  // // filteredRecommneded[0].items.map((item) => (
  // //   getPlaceWithPlaceId(item.placeId)
  // // ))
  //   //map through each


}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


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
      console.log(placeId, 'placeId getPlaceReviews')
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
      
  },

  getCuratedListPlaces: async ({userId}) => {
    // userId is temp for testing. ==> 6 is where the curated lists are
    console.log('hits resolver')
    const allcuratedList = await getRecommendedList();
    const list = await Promise.all(
      allcuratedList.map(async (curatedList) => {  //each list
        const itemsWithDetails = [];

        const curatedLists = await Promise.all(
          curatedList.items.map(async (item) => { //then the items of each list
            const placeDetails = await getSpecificPlaceWithReview(item.dataValues.placeId)
            console.log(placeDetails, 'should just be placeDetails')
            itemsWithDetails.push(placeDetails)
            await delay(200);
          })
        )

        // )

        console.log(itemsWithDetails, 'itemsWithDetails')
        console.log(curatedLists, 'curatedLists')
        return {
          ...curatedList,
          items: itemsWithDetails
        }
        
      })

    )
    console.log(list, 'all data in list')
    console.log(list[0].items, 'items in list')
    return {list};
      //now to make sure this returns with matching schema. it will most likely not since reviews is now added
      //either create new schema or remove review entirely. probably best to remove reviews
        //since querying to database, i can retreive later without going through google api
          // and then finally create new field to check if its curated instead of userId
  }

};


module.exports = resolver;