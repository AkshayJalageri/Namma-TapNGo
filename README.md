# Namma TapNGo - Metro Ticketing System

> Scan. Ride. Pay. Simple.

A MERN stack metro ticketing simulation system that allows users to use QR codes for entry and exit at metro stations, with automatic fare calculation and wallet management.

## Features

- User Authentication (Registration/Login) with JWT
- QR Code Generation for each user
- Wallet Management (Add/Top-up balance)
- Gate Simulation (Entry/Exit)
- Fare Calculation based on stations
- Trip History

## Project Structure

```
├── backend/           # Node.js/Express backend
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── server.js      # Entry point
├── frontend/          # React/Vite frontend
│   ├── public/        # Static files
│   ├── src/           # Source files
│   │   ├── assets/    # Images, fonts, etc.
│   │   ├── components/# Reusable components
│   │   ├── context/   # Context providers
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   ├── utils/     # Utility functions
│   │   ├── App.jsx    # Main component
│   │   └── main.jsx   # Entry point
│   └── index.html     # HTML template
└── README.md          # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Seed the database with stations:
   ```
   npm run seed
   ```

5. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Demo Flow

1. Register a new account
2. View your QR code on the dashboard
3. Add balance to your wallet
4. Go to the Gate Simulator page
5. Select "Entry" mode and a station
6. Scan your QR code (via webcam or upload)
7. Switch to "Exit" mode and select a different station
8. Scan your QR code again
9. View the fare deduction and trip details
10. Check your trip history and updated wallet balance

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **Frontend**: React, Vite, React Router, Axios
- **QR Code**: qrcode.react, react-qr-reader
- **Styling**: CSS Modules or Tailwind CSS