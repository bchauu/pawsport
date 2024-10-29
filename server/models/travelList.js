const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
    const TravelList = sequelize.define('TravelList', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
        userId: {
            type: DataTypes.BIGINT,
            field: 'user_id',
            allowNull: false,
            references: {
                model: 'users',  // Ensure this is the correct table name
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        uuid: {
            type: DataTypes.UUID,
            allowNull: true,
            unique: true,
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            field: 'is_public',
            allowNull: false,
            defaultValue: false
        },
        viewCount: {
            type: DataTypes.INTEGER,
            field: 'view_count',
            defaultValue: 0
        },
        likesCount: {
            type: DataTypes.INTEGER,
            field: 'likes_count',
            defaultValue: 0
        }
    }, {
        tableName: 'travel_list',
        timestamps: true
    });

    TravelList.associate = function(models) {
        // Association with the User model
        TravelList.belongsTo(models.User, { foreignKey: 'userId' });
        // Association with the TravelItem model
        TravelList.hasMany(models.TravelItems, { foreignKey: 'travelListId', as: 'items' });
    };

    return TravelList;
};