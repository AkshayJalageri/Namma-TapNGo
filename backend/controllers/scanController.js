const Trip = require('../models/Trip');
const Station = require('../models/Station');
const Fare = require('../models/Fare');
const { verifyQrToken } = require('../middleware/auth');
const { hasMinimumBalance, deductMoney } = require('./walletController');

// Handle entry scan
exports.scanEntry = async (req, res) => {
  try {
    const { qrToken, stationId } = req.body;

    // Validate input
    if (!qrToken || !stationId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide QR token and station ID'
      });
    }

    // Verify QR token
    const verification = verifyQrToken(qrToken);
    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    const userId = verification.userId;

    // Check if user has an active trip
    const activeTrip = await Trip.findOne({
      user: userId,
      status: 'in-progress'
    });

    if (activeTrip) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active trip. Please exit first.'
      });
    }

    // Check if user has minimum balance
    const hasBalance = await hasMinimumBalance(userId);
    if (!hasBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance. Please add money to your wallet.'
      });
    }

    // Find station
    const station = await Station.findOne({ stationId });
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Create new trip
    const trip = await Trip.create({
      user: userId,
      entryStation: station._id,
      entryTimestamp: Date.now(),
      status: 'in-progress'
    });

    res.status(201).json({
      success: true,
      message: 'Entry successful',
      data: {
        tripId: trip._id,
        entryStation: station.name,
        entryTime: trip.entryTimestamp
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing entry scan',
      error: error.message
    });
  }
};

// Handle exit scan
exports.scanExit = async (req, res) => {
  try {
    const { qrToken, stationId } = req.body;

    // Validate input
    if (!qrToken || !stationId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide QR token and station ID'
      });
    }

    // Verify QR token
    const verification = verifyQrToken(qrToken);
    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    const userId = verification.userId;

    // Find active trip
    const trip = await Trip.findOne({
      user: userId,
      status: 'in-progress'
    });

    if (!trip) {
      return res.status(400).json({
        success: false,
        message: 'No active trip found. Please enter first.'
      });
    }

    // Find exit station
    const exitStation = await Station.findOne({ stationId });
    if (!exitStation) {
      return res.status(404).json({
        success: false,
        message: 'Exit station not found'
      });
    }

    // Calculate fare
    let fare;
    
    // If entry and exit stations are the same, use minimum fare
    if (trip.entryStation.toString() === exitStation._id.toString()) {
      fare = Number(process.env.MIN_FARE) || 10;
    } else {
      // Find fare between stations
      const fareRecord = await Fare.findOne({
        $or: [
          { fromStation: trip.entryStation, toStation: exitStation._id },
          { fromStation: exitStation._id, toStation: trip.entryStation }
        ]
      });

      if (fareRecord) {
        fare = fareRecord.fare;
      } else {
        // Default fare calculation based on minimum fare
        fare = Number(process.env.MIN_FARE) || 10;
      }
    }

    // Deduct fare from wallet
    const deduction = await deductMoney(userId, fare);
    if (!deduction.success) {
      return res.status(400).json({
        success: false,
        message: deduction.message
      });
    }

    // Update trip
    trip.exitStation = exitStation._id;
    trip.exitTimestamp = Date.now();
    trip.fare = fare;
    trip.status = 'completed';
    await trip.save();

    // Calculate trip duration
    const durationMs = trip.exitTimestamp - trip.entryTimestamp;
    const durationMinutes = Math.floor(durationMs / 60000);

    res.status(200).json({
      success: true,
      message: 'Exit successful',
      data: {
        tripId: trip._id,
        entryStation: (await Station.findById(trip.entryStation)).name,
        exitStation: exitStation.name,
        fare: fare,
        duration: durationMinutes,
        entryTime: trip.entryTimestamp,
        exitTime: trip.exitTimestamp,
        remainingBalance: deduction.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing exit scan',
      error: error.message
    });
  }
};