const express = require('express');
import { textSearch } from '../controllers/searchController';

const router = express.Router();

router.post('/location', textSearch);
