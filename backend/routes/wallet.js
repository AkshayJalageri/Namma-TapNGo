const express = require('express');
const { getBalance, addMoney } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Wallet routes
router.get('/balance', getBalance);
router.post('/add', addMoney);

module.exports = router;