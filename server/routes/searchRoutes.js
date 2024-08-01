const express = require('express');
import exp from 'constants';
import { textSearch } from '../controllers/searchController';

const router = express.Router();

router.post('/location', textSearch);