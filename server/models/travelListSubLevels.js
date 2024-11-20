const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    const TravelListSubLevels = sequelize.define('TravelListSubLevels', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()')
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        },
        travelListId: {
            type: DataTypes.BIGINT,
            field: 'travel_list_id',
            allowNull: false,
        },
    }, {
        tableName: 'travel_list_sub_levels',
        timestamps: true
    });

    TravelListSubLevels.associate = function(models) {
        TravelListSubLevels.belongsTo(models.TravelList, { foreignKey: 'travelListId', as: 'travelList' });

    };

    return TravelListSubLevels;
};