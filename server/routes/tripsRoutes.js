const express = require('express');
const {addCreate, getList, getListswithPlaces } = require('../controllers/travelListController');
const {addPlaceToList, getPlace} = require('../controllers/travelItemController');

const router = express.Router();

router.post('/list', addCreate);

router.get('/list', getList);

router.get('/lists/places', getListswithPlaces);

router.get('/lists/:listId/places', getPlace); 

router.post('/lists/places', addPlaceToList); 

module.exports = router;
