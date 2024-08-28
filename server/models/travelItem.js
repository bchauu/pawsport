const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TravelItems = sequelize.define('TravelItems', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
        notes: {
            type: DataTypes.STRING,
            allowNull: true
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
    };

    return TravelItems;
};