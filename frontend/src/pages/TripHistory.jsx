import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './TripHistory.css';

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get('/trips');
        
        if (res.data.success) {
          setTrips(res.data.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching trip history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrips();
  }, []);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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
    <div className="trip-history-page">
      <h1>Trip History</h1>
      
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="no-trips">
          <p>You haven't taken any trips yet.</p>
          <p>Use the Gate Simulator to try out the metro experience!</p>
        </div>
      ) : (
        <div className="trips-container">
          <div className="trips-header">
            <div className="trip-date">Date & Time</div>
            <div className="trip-stations">Stations</div>
            <div className="trip-duration">Duration</div>
            <div className="trip-fare">Fare</div>
          </div>
          
          {trips.map((trip) => (
            <div key={trip._id} className={`trip-card ${trip.status}`}>
              <div className="trip-date">
                {formatDate(trip.entryTimestamp)}
              </div>
              
              <div className="trip-stations">
                <div className="station entry-station">
                  <span className="station-label">From:</span>
                  <span className="station-name">{trip.entryStation?.name || 'Unknown'}</span>
                </div>
                
                {trip.status === 'completed' && (
                  <div className="station exit-station">
                    <span className="station-label">To:</span>
                    <span className="station-name">{trip.exitStation?.name || 'Unknown'}</span>
                  </div>
                )}
                
                {trip.status === 'in-progress' && (
                  <div className="station exit-station in-progress">
                    <span className="station-label">To:</span>
                    <span className="station-name">Journey in progress</span>
                  </div>
                )}
              </div>
              
              <div className="trip-duration">
                {trip.status === 'completed' 
                  ? calculateDuration(trip.entryTimestamp, trip.exitTimestamp)
                  : 'In progress'}
              </div>
              
              <div className="trip-fare">
                {trip.status === 'completed' 
                  ? `₹${trip.fare.toFixed(2)}`
                  : '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripHistory;