const { buildSchema } = require('graphql');

const schema = buildSchema(`

  type Location {
    lat: Float!
    lng: Float!
  }

  type Geometry {
    location: Location
  }

  type Result {
    geometry: Geometry
  }


  type Query {
    geoCode(query: String!): [Result]
  }

`);

module.exports = schema;