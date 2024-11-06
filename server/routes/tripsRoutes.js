const express = require('express');
const {addCreate, getList, getListswithPlaces, getSharedList} = require('../controllers/travelListController');
const {addPlaceToList, getPlace, deletePlaceFromList} = require('../controllers/travelItemController');

const router = express.Router();

router.delete('/lists/places/delete', deletePlaceFromList);

// router.delete('lists/test', deletePlaceFromList);

router.post('/list', addCreate);

router.get('/list', getList);

router.get('/lists/shared', getSharedList)

router.get('/lists/places', getListswithPlaces);

router.get('/lists/:listId/places', getPlace); 

router.post('/lists/places', addPlaceToList); 


module.exports = router;
