const express = require('express');
const { getTrips, getTrip, getActiveTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Trip routes
router.get('/', getTrips);
router.get('/active', getActiveTrip);
router.get('/:id', getTrip);

module.exports = router;