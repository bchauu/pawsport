const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            field: 'created_at',  // Map to the snake_case column name
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()')
        },
        updatedAt: {
            field: 'updated_at',  // Map to the snake_case column name
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('NOW()')
        }
    }, {
        tableName: 'users',
        timestamps: true
    });

    User.associate = function(model) {
        User.hasMany(model.TravelList, { foreignKey: 'userId' })
    }

    return User;
};