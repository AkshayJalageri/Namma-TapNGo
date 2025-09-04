const Trip = require('../models/Trip');

// Get all trips for a user
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id })
      .populate('entryStation', 'name stationId')
      .populate('exitStation', 'name stationId')
      .sort({ entryTimestamp: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting trips',
      error: error.message
    });
  }
};

// Get a single trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('entryStation', 'name stationId')
      .populate('exitStation', 'name stationId');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    // Check if trip belongs to user
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this trip'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting trip',
      error: error.message
    });
  }
};

// Get active trip (in-progress)
exports.getActiveTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      user: req.user.id,
      status: 'in-progress'
    }).populate('entryStation', 'name stationId');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'No active trip found'
      });
    }

    res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting active trip',
      error: error.message
    });
  }
};