const { Op } = require('sequelize'); 
const {TravelList, User, ListPermission} = require('../models'); // Your TravelList model
const listPermission = require('../models/listPermission');

exports.grantPermission = async (req, res) => {
    console.log('granting permission')
    try {
      const { travelListId, sharedUserName, sharedEmail, permissionType } = req.body;
      const travelList = await TravelList.findByPk(travelListId);
      if (!travelList || travelList.userId !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to share this list' });
      }

  
      // Find the user by username and email
      const sharedUser = await User.findOne({
        where: {
          email: sharedEmail
        }
      });
      
      if (!sharedUser) {
        res.status(409).json({prevPermission, message: "No user found with that email."})
      }

      const prevPermission = await ListPermission.findOne({ where: { travelListId: travelListId, userId: sharedUser.id } });

      if (prevPermission) {
        res.status(409).json({prevPermission, message: 'already granted permission'})
      } else {
          
        const permission = await ListPermission.create({
          travelListId,
          userId: sharedUser.id,
          permissionType,
        });
    
        res.status(201).json({permission});
      }

    } catch (error) {
      console.error('Error granting permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


// Revoke permission
exports.revokePermission = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the permission entry
      const permission = await ListPermission.findByPk(id, {
        include: {
          model: TravelList,
        }
      });

      console.log(permission, 'permissionrevoke')
  
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
      if (permission.dataValues.TravelList.dataValues.userId !== req.user.userId) {   
        
        return res.status(403).json({ message: 'Not authorized to revoke this permission' });
      }
  
      await permission.destroy();
      res.status(200).json({ message: 'Permission revoked' });
    } catch (error) {
      console.error('Error revoking permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Update permission
exports.updatePermission = async (req, res) => {
    try {
      const { id } = req.params;
      const { permissionType } = req.body;
  
      // Find the permission entry
      const permission = await ListPermission.findByPk(id, {
        include: {
          model: TravelList,
          as: 'travelList',  // Adjust 'as' if you have specified differently in associations
        }
      });
  
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
  
      // Check if the current user is the owner of the travel list
      if (permission.travelList.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this permission' });
      }
  
      // Update the permission type
      permission.permissionType = permissionType;
      await permission.save();
  
      res.status(200).json(permission);
    } catch (error) {
      console.error('Error updating permission:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Get permissions for a list
exports.getPermissions = async (req, res) => {
    try {
      const { travelListId } = req.params;
  
      // Fetch the travel list to ensure the requesting user has access
      const travelList = await TravelList.findByPk(travelListId);

  
      // Check if the current user is the owner or has permissions
      if (!travelList || (travelList.userId !== req.user.userId)) {
        return res.status(403).json({ message: 'Not authorized to view permissions for this list' });
      }
  
      // Fetch permissions related to the specified travel list
      const permissions = await ListPermission.findAll({
        where: { travelListId },
      });

      const permissionEmail = await Promise.all(
        permissions.map( async (permission) => {
          const listPermissionId = permission.id;
          const foundUser = await User.findByPk(permission.userId)
          const {email, id} = foundUser; 
          return {email, userId: id, listPermissionId };
        })
      )
  
      res.status(201).json(permissionEmail);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };