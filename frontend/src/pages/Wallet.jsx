import React from 'react';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Wallet.css';

const Wallet = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddMoney = async (e) => {
    e.preventDefault();
    
    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const res = await axios.post('/wallet/add', { amount: amountNum });
      
      if (res.data.success) {
        toast.success(res.data.message);
        setAmount('');
        updateUserData(); // Update user data to reflect new balance
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding money to wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  const presetAmounts = [50, 100, 200, 500];
  
  return (
    <div className="wallet-page">
      <h1>Wallet</h1>
      
      <div className="wallet-container">
        <div className="balance-card">
          <h2>Current Balance</h2>
          <div className="balance-amount">₹{user?.walletBalance.toFixed(2)}</div>
          <p className="balance-info">
            Minimum balance required for travel: ₹10.00
          </p>
        </div>
        
        <div className="add-money-card">
          <h2>Add Money</h2>
          
          <div className="preset-amounts">
            {presetAmounts.map(preset => (
              <button 
                key={preset} 
                className="preset-btn" 
                onClick={() => setAmount(preset.toString())}
              >
                ₹{preset}
              </button>
            ))}
          </div>
          
          <form onSubmit={handleAddMoney}>
            <div className="form-group">
              <label htmlFor="amount">Enter Amount (₹)</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Add Money'}
            </button>
          </form>
          
          <div className="payment-info">
            <p>Note: This is a simulation. In a real app, this would connect to a payment gateway.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;