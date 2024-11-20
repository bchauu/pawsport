const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TravelItems = sequelize.define('TravelItems', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        travelListId: {
            type: DataTypes.BIGINT,
            field: 'travel_list_id',
            allowNull: false,
        },
        placeId: {
            type: DataTypes.STRING,
            field: 'place_id'
        },
        viewCount: {
            type: DataTypes.INTEGER,
            field: 'view_count',
            defaultValue: 0
        },
        addedCount: {
            type: DataTypes.INTEGER,
            field: 'added_count',
            defaultValue: 0
        },
        subLevelName: {
            type: DataTypes.STRING,
            field: 'sub_level_name'
        },
        lat: {
            type: DataTypes.FLOAT,
        },
        lng: {
            type: DataTypes.FLOAT,
        }
    }, {
        tableName: 'travel_item',
        timestamps: true
    });

    TravelItems.associate = function(models) {
        TravelItems.belongsTo(models.TravelList, { foreignKey: 'travelListId' });

        TravelItems.hasMany(models.ItemNotes, { 
            foreignKey: 'travelItemId', // Matches the belongsTo foreign key
            as: 'notes', // Alias for the association
        });
    };

    return TravelItems;
};