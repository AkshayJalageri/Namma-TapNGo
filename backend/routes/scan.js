const express = require('express');
const { scanEntry, scanExit } = require('../controllers/scanController');

const router = express.Router();

// Scan routes
router.post('/entry', scanEntry);
router.post('/exit', scanExit);

module.exports = router;