const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Place {
    id: ID!
    name: String!
    address: String!
    latitude: Float
    longitude: Float
    types: [String]
    rating: Float
    userRatingsTotal: Int
  }

  type Query {
    searchPlaces(query: String!): [Place]
    getPlaceById(id: ID!): Place
  }
`);

module.exports = schema;