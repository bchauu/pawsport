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
    types: [String]
    user_ratings_total: String
    photos: [PhotoAtt]
    rankby: String
    price_level: Int
    vicinity: String
  }

  type Response {
    result: [Result]
    next_page_token: String
  }

  input Coordinates {
    lat: Float
    lng: Float
  }

  type Review {
    author: String
    rating: Int
    text: String
    relativeTimeDescription: String
  }

  type ReviewResponse {
    reviews: [Review]
  }

  type Query {
    searchPlaces(location: Coordinates, type: String, radius: Int, nextPageToken: String): Response
    getPlaceReviews(placeId: String!): ReviewResponse
  }
`);

//query response needs to be defined as a type as top level.


module.exports = schema;