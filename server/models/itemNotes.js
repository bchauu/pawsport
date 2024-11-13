const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ItemNotes = sequelize.define('ItemNotes', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    travelItemId: { // Foreign key to `TravelItems`
      type: DataTypes.BIGINT,
      allowNull: false, // Ensure this field is required
      field: 'travel_item_id', // Maps to `travel_item_id` in the database
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true, // Note content
    },
    //userId field --> to reference Users Table
  }, {
    tableName: 'item_notes', // Maps to `item_notes` in the database
    timestamps: true,
  });

  ItemNotes.associate = (models) => {
    ItemNotes.belongsTo(models.TravelItems, { 
      foreignKey: 'travelItemId', // Matches the `hasMany` foreign key
      as: 'travelItem', // Alias for accessing the parent travel item
    });
  };

  return ItemNotes;
};