const express = require('express');
const {suggestions} = require('../controllers/locationController');

const router = express.Router();

router.post('/suggest', suggestions);

module.exports = router;
