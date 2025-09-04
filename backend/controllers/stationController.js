const Station = require('../models/Station');

// Get all stations
exports.getStations = async (req, res) => {
  try {
    const stations = await Station.find({ isActive: true })
      .select('name stationId line')
      .sort({ line: 1, stationId: 1 });

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting stations',
      error: error.message
    });
  }
};

// Get station by ID
exports.getStation = async (req, res) => {
  try {
    const station = await Station.findOne({ stationId: req.params.stationId });

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.status(200).json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting station',
      error: error.message
    });
  }
};