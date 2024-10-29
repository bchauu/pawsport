const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const ListPermission = sequelize.define('ListPermission', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    travelListId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'travel_list', // Ensure this is the correct table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users', // Ensure this is the correct table name
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    permissionType: {
      type: DataTypes.ENUM('view', 'edit'),
      allowNull: false,
      defaultValue: 'view', // Default to 'view' permission
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'list_permissions',
    timestamps: true,
  });

  ListPermission.associate = function(models) {
    // Associations can be defined here
    ListPermission.belongsTo(models.TravelList, { foreignKey: 'travelListId' });
    ListPermission.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return ListPermission;
};