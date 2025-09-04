const express = require('express');
const { getStations, getStation } = require('../controllers/stationController');

const router = express.Router();

// Station routes (public - no authentication required)
router.get('/', getStations);
router.get('/:stationId', getStation);

module.exports = router;