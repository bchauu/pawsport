const { validate } = require('graphql');
const { DataTypes } = require('sequelize');

module.exports = PlaceDetails = (sequelize) => {
    const PlaceDetails = sequelize.define('PlaceDetails', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          placeId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensures no duplicate Place IDs
            field: 'place_id'
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false, // Name is required
          },
          address: {
            type: DataTypes.TEXT, // Longer field for full address
          },
          location: {
            type: DataTypes.JSONB,
            allowNull: false,
            validate: {
                notEmpty: true
            }
          },
          businessStatus: {
            type: DataTypes.STRING,
            field: 'business_status'
          },
          types: {
            type: DataTypes.JSONB,
            allowNull: true
          },
          userRatingTotal: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'user_ratings_total'
          },
          vicinity: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          rating: {
            type: DataTypes.FLOAT, // Average rating
          },
          photos: {
            type: DataTypes.JSONB,
            allowNull: true, // Reference to photo (if provided by Google API)
          },
          lastUpdated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Automatically set timestamp when updated
            field: 'last_updated'
          }
    },   {
        tableName: 'place_details', // Explicit table name
        timestamps: false, // Disable automatic `createdAt` and `updatedAt`
      });

      PlaceDetails.associate = function(models) {

        PlaceDetails.belongsToMany(models.TravelItems, {
          through: 'TravelItemPlace', // Junction table name
          foreignKey: 'placeDetailId', // Foreign key in the junction table referencing PlaceDetails
          as: 'travelItems'
        });

        PlaceDetails.hasMany(models.PlaceReview, {
            foreignKey: 'place_id', // Foreign key in `PlaceReview`
            as: 'reviews', // Alias for the association
          });
      };

      return PlaceDetails;
};

