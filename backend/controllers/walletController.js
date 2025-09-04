const User = require('../models/User');

// Get wallet balance
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting wallet balance',
      error: error.message
    });
  }
};

// Add money to wallet
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    // Update user wallet
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { walletBalance: amount } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance
      },
      message: `₹${amount} added to wallet successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding money to wallet',
      error: error.message
    });
  }
};

// Deduct money from wallet (internal function, not exposed as API)
exports.deductMoney = async (userId, amount) => {
  try {
    // Get user
    const user = await User.findById(userId);
    
    // Check if user has sufficient balance
    if (user.walletBalance < amount) {
      return {
        success: false,
        message: 'Insufficient wallet balance'
      };
    }
    
    // Update wallet balance
    user.walletBalance -= amount;
    await user.save();
    
    return {
      success: true,
      walletBalance: user.walletBalance
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error deducting money from wallet',
      error: error.message
    };
  }
};

// Check if user has minimum balance (internal function)
exports.hasMinimumBalance = async (userId) => {
  try {
    const user = await User.findById(userId);
    const minFare = process.env.MIN_FARE || 10;
    
    return user.walletBalance >= minFare;
  } catch (error) {
    return false;
  }
};