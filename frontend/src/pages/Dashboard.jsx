import React from 'react';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentTrips, setRecentTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  
  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        const res = await axios.get('/trips');
        
        if (res.data.success) {
          // Get only the 3 most recent trips
          setRecentTrips(res.data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching recent trips:', error);
      } finally {
        setIsLoadingTrips(false);
      }
    };
    
    fetchRecentTrips();
  }, []);

  // Function to download QR code as image
  const downloadQRCode = () => {
    if (!user?.qrCode) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = user.qrCode;
    link.download = 'namma-tapngo-travel-pass.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Calculate trip duration
  const calculateDuration = (entry, exit) => {
    if (!entry || !exit) return 'N/A';
    
    const entryTime = new Date(entry);
    const exitTime = new Date(exit);
    const durationMs = exitTime - entryTime;
    
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    
    return `${minutes}m`;
  };

  return (
    <div className="dashboard">
      <h1>Welcome to Namma TapNGo</h1>
      
      <div className="dashboard-content">
        <div className="qr-section">
          <h2>Your Travel Pass</h2>
          <p className="qr-instruction">Scan this QR code at metro entry and exit gates</p>
          
          <div className="qr-container">
            {user?.qrCode ? (
              <img src={user.qrCode} alt="QR Code" className="qr-code" />
            ) : (
              <div className="qr-placeholder">QR Code not available</div>
            )}
          </div>
          
          <div className="qr-info">
            <p>This is your permanent travel pass</p>
            <p>Keep it safe and accessible on your device</p>
            {user?.qrCode && (
              <button 
                onClick={downloadQRCode} 
                className="btn btn-outline download-qr-btn"
              >
                Download QR Code
              </button>
            )}
          </div>
        </div>
        
        <div className="dashboard-info">
          <div className="info-card wallet-info">
            <h3>Wallet Balance</h3>
            <p className="balance">₹{user?.walletBalance.toFixed(2)}</p>
            <Link to="/wallet" className="btn btn-primary">Add Money</Link>
          </div>
          
          <div className="info-card">
            <h3>How to Use</h3>
            <ol className="instructions-list">
              <li>Ensure you have sufficient balance in your wallet</li>
              <li>At the entry gate, select "Entry" mode and scan your QR</li>
              <li>At the exit gate, select "Exit" mode and scan the same QR</li>
              <li>Fare will be automatically deducted from your wallet</li>
            </ol>
          </div>
          
          <div className="info-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <Link to="/wallet" className="btn btn-outline">Manage Wallet</Link>
              <Link to="/trips" className="btn btn-outline">View Trip History</Link>
              <Link to="/gate-simulator" className="btn btn-outline">Try Gate Simulator</Link>
            </div>
          </div>
          
          <div className="info-card recent-trips-card">
            <h3>Recent Trips</h3>
            {isLoadingTrips ? (
              <div className="loading-trips">Loading your recent trips...</div>
            ) : recentTrips.length === 0 ? (
              <div className="no-trips">
                <p>You haven't taken any trips yet.</p>
                <p>Use the Gate Simulator to try out the metro experience!</p>
              </div>
            ) : (
              <div className="recent-trips-list">
                {recentTrips.map((trip) => (
                  <div key={trip._id} className="recent-trip-item">
                    <div className="trip-stations-info">
                      <div className="trip-station-entry">
                        <span className="station-dot entry-dot"></span>
                        <span className="station-name">{trip.entryStation?.name || 'Unknown'}</span>
                        <span className="trip-time">{formatDate(trip.entryTimestamp)}</span>
                      </div>
                      
                      {trip.status === 'completed' && (
                        <div className="trip-station-exit">
                          <span className="station-dot exit-dot"></span>
                          <span className="station-name">{trip.exitStation?.name || 'Unknown'}</span>
                          <span className="trip-time">{formatDate(trip.exitTimestamp)}</span>
                        </div>
                      )}
                      
                      {trip.status === 'in-progress' && (
                        <div className="trip-station-exit in-progress">
                          <span className="station-dot exit-dot in-progress"></span>
                          <span className="station-name in-progress">Journey in progress</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="trip-details">
                      {trip.status === 'completed' && (
                        <>
                          <div className="trip-duration">
                            <span className="detail-label">Duration:</span>
                            <span className="detail-value">{calculateDuration(trip.entryTimestamp, trip.exitTimestamp)}</span>
                          </div>
                          <div className="trip-fare">
                            <span className="detail-label">Fare:</span>
                            <span className="detail-value fare-amount">₹{trip.fare.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      {trip.status === 'in-progress' && (
                        <div className="trip-status">
                          <span className="status-badge">In Progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Link to="/trips" className="view-all-trips">View all trips →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;