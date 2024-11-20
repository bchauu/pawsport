const express = require('express');
const {addCreate, getList, getListswithPlaces, getSharedList, addSubLevel, deleteSubLevel} = require('../controllers/travelListController');
const {addPlaceToList, getPlace, deletePlaceFromList, addNote, getNotes} = require('../controllers/travelItemController');

const router = express.Router();

router.delete('/lists/places/delete', deletePlaceFromList);

// router.delete('lists/test', deletePlaceFromList);

router.post('/list', addCreate);

router.get('/list', getList);

router.get('/lists/shared', getSharedList)

router.post('/lists/addSubLevel', addSubLevel)

router.delete('/lists/deleteSubLevel', deleteSubLevel);

router.get('/lists/places', getListswithPlaces);

router.get('/lists/:listId/places', getPlace); 

router.post('/lists/places', addPlaceToList); 

router.post('/lists/places/note', addNote); 

router.get('/list/places/allnotes', getNotes)

module.exports = router;
