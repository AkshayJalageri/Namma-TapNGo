require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/namma-tapngo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for cleanup'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Clear database function
const clearDatabase = async () => {
  try {
    // Clear specific collections using Mongoose models
    const Station = require('../models/Station');
    const Fare = require('../models/Fare');
    const Trip = require('../models/Trip');
    const User = require('../models/User');
    
    await Station.deleteMany({});
    console.log('Cleared stations collection');
    
    await Fare.deleteMany({});
    console.log('Cleared fares collection');
    
    await Trip.deleteMany({});
    console.log('Cleared trips collection');
    
    await User.deleteMany({});
    console.log('Cleared users collection');
    
    console.log('Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Run the cleanup function
clearDatabase();
