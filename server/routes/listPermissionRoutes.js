const express = require('express');
const router = express.Router();
const listPermissionController = require('../controllers/listPermissionController');

// Grant permission
router.post('/grant', listPermissionController.grantPermission);

// Revoke permission
router.delete('/:id', listPermissionController.revokePermission);

// // Update permission
// router.put('/:id', listPermissionController.updatePermission);

// Get permissions for a list
router.get('/:travelListId', listPermissionController.getPermissions);

module.exports = router;