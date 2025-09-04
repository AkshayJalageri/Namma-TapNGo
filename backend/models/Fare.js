const mongoose = require('mongoose');

const fareSchema = new mongoose.Schema({
  fromStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: [true, 'Please provide a source station']
  },
  toStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: [true, 'Please provide a destination station']
  },
  fare: {
    type: Number,
    required: [true, 'Please provide a fare amount'],
    min: [0, 'Fare cannot be negative']
  }
});

// Compound index to ensure unique pairs of stations
fareSchema.index({ fromStation: 1, toStation: 1 }, { unique: true });

module.exports = mongoose.model('Fare', fareSchema);