const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  },
  entryStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: [true, 'Please provide an entry station']
  },
  exitStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    default: null
  },
  entryTimestamp: {
    type: Date,
    default: Date.now
  },
  exitTimestamp: {
    type: Date,
    default: null
  },
  fare: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'cancelled'],
    default: 'in-progress'
  }
});

// Index for faster queries by user
tripSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Trip', tripSchema);