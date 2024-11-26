const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Location {
    lat: Float!
    lng: Float!
  }

  type PhotoAtt {
    height: Int
    photoReference: String
    width: Int
    photoUrl: String
  }

  type Result {
    name: String
    location: Location
    business_status: String
    businessStatus: String
    placeId: String
    address: String
    rating: Float
    types: [String]
    userRatingTotal: Float
    photos: [PhotoAtt]
    rankby: String
    vicinity: String
    last_updated: String
    lastUpdated: String
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

  type subLevel {
    id: String
    createdAt: String
    travelListId: String
    name: String
    updatedAt: String
  }

  type TravelList {
    id: ID!
    createdAt: String!
    updatedAt: String
    userId: String!
    name: String!
    uuid: String!
    isPublic: Boolean!
    viewCount: String!
    likesCount: String!
    listType: String
    subLevels: [subLevel]
    items: [Result]
  }

  type ReviewResponse {
    reviews: [Review]
  }

  type CuratedResponse {
    list: [TravelList]
  }

  type Query {
    searchPlaces(location: Coordinates, type: String, radius: Int, nextPageToken: String): Response
    getPlaceReviews(placeId: String!): ReviewResponse
    resolveAndExtractPlace(url: String!): Response
    getCuratedListPlaces(userId: String!): CuratedResponse
  }
`);

//query response needs to be defined as a type as top level.


module.exports = schema;