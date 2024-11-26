const { DataTypes } = require('sequelize');

module.exports = PlaceReview = (sequelize) => {
  const PlaceReview = sequelize.define(
    'PlaceReview',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      placeId: {
        type: DataTypes.STRING,
        allowNull: false, // Ensures every review is linked to a place
        field: 'place_id'
      },
      authorName: {
        type: DataTypes.STRING, // Name of the reviewer
        allowNull: true,
        field: 'author_name'
      },
      language: {
        type: DataTypes.STRING, // Language of the review
        allowNull: true,
      },
      originalLanguage: {
        type: DataTypes.STRING, // Original language of the review if translated
        allowNull: true,
        field: 'original_language'
      },
      rating: {
        type: DataTypes.FLOAT, // Rating given by the reviewer
        allowNull: true,
      },
      relativeTimeDescription: {
        type: DataTypes.STRING, // Description of when the review was posted
        allowNull: true,
        field: 'relative_time_description'
      },
      text: {
        type: DataTypes.TEXT, // Review text
        allowNull: true,
      },
      translated: {
        type: DataTypes.BOOLEAN, // Indicates if the review was translated
        defaultValue: false,
      },
    },
    {
      tableName: 'place_reviews', // Explicit table name
      timestamps: false, // Disable automatic `createdAt` and `updatedAt`
    }
  );

  // Define associations
  PlaceReview.associate = function (models) {
    PlaceReview.belongsTo(models.PlaceDetails, {
      foreignKey: 'place_id', // Foreign key referencing `PlaceDetails.place_id`
      as: 'place', // Alias for the association
    });
  };

  return PlaceReview;
};