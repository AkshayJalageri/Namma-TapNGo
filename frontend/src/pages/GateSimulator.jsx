import React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { QrScanner } from '@yudiel/react-qr-scanner';
import './GateSimulator.css';

const GateSimulator = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [mode, setMode] = useState('entry'); // 'entry' or 'exit'
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const fileInputRef = useRef(null);
  
  // Fetch stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        // In a real app, this would be a separate API endpoint
        // For this demo, we'll use the seed data directly
        const stationsData = [
          { stationId: 'P01', name: 'Baiyappanahalli', line: 'Purple' },
          { stationId: 'P02', name: 'Swami Vivekananda Road', line: 'Purple' },
          { stationId: 'P03', name: 'Indiranagar', line: 'Purple' },
          { stationId: 'P04', name: 'Halasuru', line: 'Purple' },
          { stationId: 'P05', name: 'Trinity', line: 'Purple' },
          { stationId: 'P06', name: 'MG Road', line: 'Purple' },
          { stationId: 'P07', name: 'Cubbon Park', line: 'Purple' },
          { stationId: 'P08', name: 'Vidhana Soudha', line: 'Purple' },
          { stationId: 'P09', name: 'Sir M Visvesvaraya', line: 'Purple' },
          { stationId: 'P10', name: 'Majestic (Kempegowda)', line: 'Purple' },
          { stationId: 'G01', name: 'Nagasandra', line: 'Green' },
          { stationId: 'G02', name: 'Dasarahalli', line: 'Green' },
          { stationId: 'G03', name: 'Jalahalli', line: 'Green' },
          { stationId: 'G04', name: 'Peenya Industry', line: 'Green' },
          { stationId: 'G05', name: 'Peenya', line: 'Green' },
          { stationId: 'G14', name: 'Majestic (Kempegowda)', line: 'Green' },
          { stationId: 'G15', name: 'Chickpete', line: 'Green' },
          { stationId: 'G16', name: 'Krishna Rajendra Market', line: 'Green' },
        ];
        
        setStations(stationsData);
        setSelectedStation(stationsData[0].stationId);
      } catch (error) {
        toast.error('Error fetching stations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, []);
  
  // Reset processing state when component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      setIsProcessing(false);
      setGateOpen(false);
      setScanResult(null);
      setShowScanner(false);
    };
  }, [mode, selectedStation]);

  // Reset scanner state when mode changes
  useEffect(() => {
    setShowScanner(false);
    setIsProcessing(false);
    setGateOpen(false);
    setScanResult(null);
    // Force scanner re-render by changing key
    setScannerKey(prev => prev + 1);
  }, [mode]);
  
  // Handle QR scan
  const handleScan = async (data) => {
    if (data && !isProcessing && !scanResult) {
      setIsProcessing(true);
      setScanResult(data);
      setShowScanner(false); // Close scanner immediately to prevent multiple scans
      
      try {
        // Process scan based on mode
        if (mode === 'entry') {
          await processEntry(data);
        } else {
          await processExit(data);
        }
      } catch (error) {
        console.error('Scan processing error:', error);
        setScanResult(null);
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // Handle scan error
  const handleScanError = (err) => {
    toast.error('Error scanning QR code: ' + err);
    setShowScanner(false);
  };

  // Start scanning function
  const startScanning = () => {
    // Reset all states before starting scan
    setScanResult(null);
    setIsProcessing(false);
    setGateOpen(false);
    // Force scanner re-render
    setScannerKey(prev => prev + 1);
    setShowScanner(true);
  };
  
  // Process entry scan
  const processEntry = async (qrToken) => {
    try {
      const response = await axios.post('/scan/entry', {
        qrToken,
        stationId: selectedStation
      });
      
      if (response.data.success) {
        // Show success animation
        setGateOpen(true);
        playGateSound();
        
        // Show success message
        toast.success(`Entry successful at ${response.data.data.entryStation}`);
        
        // Reset gate after animation
        setTimeout(() => {
          setGateOpen(false);
          setScanResult(null);
        }, 3000);
        
        // Update user data (wallet balance)
        updateUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Entry failed');
      setScanResult(null);
    }
  };
  
  // Process exit scan
  const processExit = async (qrToken) => {
    try {
      const response = await axios.post('/scan/exit', {
        qrToken,
        stationId: selectedStation
      });
      
      if (response.data.success) {
        // Show success animation
        setGateOpen(true);
        playGateSound();
        
        const { entryStation, exitStation, fare, duration, remainingBalance } = response.data.data;
        
        // Show detailed payment summary
        toast.success(
          <div className="exit-payment-summary">
            <h4>Journey Complete</h4>
            <div className="journey-details">
              <div className="journey-stations">
                <div className="journey-from">
                  <span className="station-label">From:</span>
                  <span className="station-value">{entryStation}</span>
                </div>
                <div className="journey-to">
                  <span className="station-label">To:</span>
                  <span className="station-value">{exitStation}</span>
                </div>
              </div>
              <div className="journey-payment">
                <div className="payment-detail">
                  <span className="detail-label">Fare:</span>
                  <span className="detail-value">₹{fare.toFixed(2)}</span>
                </div>
                <div className="payment-detail">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{duration} min</span>
                </div>
                <div className="payment-detail balance">
                  <span className="detail-label">Wallet Balance:</span>
                  <span className="detail-value">₹{remainingBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>,
          { autoClose: 8000 }
        );
        
        // Reset gate after animation
        setTimeout(() => {
          setGateOpen(false);
          setScanResult(null);
        }, 3000);
        
        // Update user data (wallet balance)
        updateUserData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Exit failed');
      setScanResult(null);
    }
  };
  
  // Play gate sound
  const playGateSound = () => {
    const audio = new Audio('/gate-beep.mp3');
    audio.play().catch(e => console.log('Audio play error:', e));
  };
  
  // Handle file upload for QR code
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        try {
          // For this demo, we'll use the user's QR token
          // This is a fallback mechanism since we're not actually decoding the QR in the image
          if (user && user.qrToken) {
            // Use the actual qrToken instead of trying to decode the image
            handleScan(user.qrToken);
            toast.info('Using your account QR code for simulation');
          } else {
            toast.error('No QR token available in your account');
          }
        } catch (error) {
          console.error('QR processing error:', error);
          toast.error('Could not process QR code from image');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  // Group stations by line
  const groupedStations = stations.reduce((acc, station) => {
    if (!acc[station.line]) {
      acc[station.line] = [];
    }
    acc[station.line].push(station);
    return acc;
  }, {});
  
  return (
    <div className="gate-simulator-page">
      <h1>Gate Simulator</h1>
      
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading stations...</p>
        </div>
      ) : (
        <div className="simulator-container">
          <div className="simulator-controls">
            <div className="mode-selector">
              <h2>Gate Mode</h2>
              <div className="mode-buttons mode-buttons-accessible">
                <button 
                  className={`mode-btn ${mode === 'entry' ? 'active' : ''}`}
                  onClick={() => setMode('entry')}
                  aria-label="Select Entry Gate Mode"
                >
                  <span className="mode-icon">⬇️</span>
                  <span className="mode-text">Entry Gate</span>
                </button>
                <button 
                  className={`mode-btn ${mode === 'exit' ? 'active' : ''}`}
                  onClick={() => setMode('exit')}
                  aria-label="Select Exit Gate Mode"
                >
                  <span className="mode-icon">⬆️</span>
                  <span className="mode-text">Exit Gate</span>
                </button>
              </div>
            </div>
            
            <div className="station-selector">
              <h2>Select Station</h2>
              <select 
                className="form-control"
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
              >
                {Object.keys(groupedStations).map(line => (
                  <optgroup key={line} label={`${line} Line`}>
                    {groupedStations[line].map(station => (
                      <option key={station.stationId} value={station.stationId}>
                        {station.name} ({station.stationId})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            
            <div className="scan-controls">
              <h2>Scan QR Code</h2>
              <div className="scan-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={startScanning}
                  disabled={showScanner || gateOpen}
                >
                  Scan with Camera
                </button>
                <span className="or">OR</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn btn-outline"
                  onClick={() => fileInputRef.current.click()}
                  disabled={showScanner || gateOpen}
                >
                  Upload QR Image
                </button>
              </div>
            </div>
          </div>
          
          <div className="gate-display">
            <div className="station-info">
              <div className="station-name">
                {stations.find(s => s.stationId === selectedStation)?.name || 'Station'}
              </div>
              <div className="station-id">
                Station ID: {selectedStation}
              </div>
              <div className="gate-mode">
                {mode.toUpperCase()} GATE
              </div>
            </div>
            
            <div className={`gate ${gateOpen ? 'open' : ''}`}>
              {gateOpen ? (
                <div className="gate-message success">
                  GATE OPEN
                </div>
              ) : (
                <div className="gate-message">
                  {showScanner ? 'SCANNING...' : 'READY TO SCAN'}
                </div>
              )}
            </div>
            
            {showScanner && (
              <div className="qr-scanner-container">
                <div className="qr-scanner-overlay">
                  <button 
                    className="close-scanner"
                    onClick={() => setShowScanner(false)}
                  >
                    ×
                  </button>
                  <QrScanner
                    key={`${mode}-${selectedStation}-${scannerKey}`}
                    onDecode={(result) => {
                      handleScan(result);
                    }}
                    onError={(error) => {
                      handleScanError(error);
                    }}
                    containerStyle={{ width: '100%' }}
                  />
                  <div className="scanner-instructions">
                    Position the QR code within the frame
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="simulator-instructions">
        <h3>How to Use the Simulator</h3>
        <ol>
          <li>Select the gate mode (Entry or Exit)</li>
          <li>Choose a station from the dropdown</li>
          <li>Scan your QR code using your webcam or upload an image</li>
          <li>For a complete journey, first use Entry mode at one station, then use Exit mode at another station</li>
        </ol>
      </div>
    </div>
  );
};

export default GateSimulator;