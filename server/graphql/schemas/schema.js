const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Location {
    lat: Float!
    lng: Float!
  }

  type PhotoAtt {
    height: Int
    photo_reference: String
    width: Int
    photoUrl: String
  }

  type Result {
    name: String
    location: Location
    business_status: String
    place_id: String
    rating: Float
    types: [String], 
    user_ratings_total: String,
    photos: [PhotoAtt]
  }

  type Response {
    result: [Result]
    next_page_token: String
  }

  type Query {
    searchPlaces(query: String, type: String, radius: Int, nextPageToken: String): Response
  }
`);


module.exports = schema;