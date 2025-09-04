const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a station name'],
    trim: true
  },
  stationId: {
    type: String,
    required: [true, 'Please provide a station ID'],
    trim: true,
    unique: true
  },
  line: {
    type: String,
    enum: ['Purple', 'Green', 'Blue', 'Yellow'],
    required: [true, 'Please specify the metro line']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create a compound index for name + line to allow same name on different lines
stationSchema.index({ name: 1, line: 1 }, { unique: true });

// Create a 2dsphere index for location-based queries
stationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Station', stationSchema);