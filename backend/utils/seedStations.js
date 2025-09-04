require('dotenv').config();
const mongoose = require('mongoose');
const Station = require('../models/Station');
const Fare = require('../models/Fare');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/namma-tapngo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Bengaluru Metro Stations
const stations = [
  // Purple Line
  {
    name: 'Baiyappanahalli',
    stationId: 'P01',
    line: 'Purple',
    location: { coordinates: [77.648609, 12.996053] }
  },
  {
    name: 'Swami Vivekananda Road',
    stationId: 'P02',
    line: 'Purple',
    location: { coordinates: [77.639597, 12.985123] }
  },
  {
    name: 'Indiranagar',
    stationId: 'P03',
    line: 'Purple',
    location: { coordinates: [77.638097, 12.978456] }
  },
  {
    name: 'Halasuru',
    stationId: 'P04',
    line: 'Purple',
    location: { coordinates: [77.626253, 12.975123] }
  },
  {
    name: 'Trinity',
    stationId: 'P05',
    line: 'Purple',
    location: { coordinates: [77.619987, 12.972456] }
  },
  {
    name: 'MG Road',
    stationId: 'P06',
    line: 'Purple',
    location: { coordinates: [77.609987, 12.969789] }
  },
  {
    name: 'Cubbon Park',
    stationId: 'P07',
    line: 'Purple',
    location: { coordinates: [77.599987, 12.967123] }
  },
  {
    name: 'Vidhana Soudha',
    stationId: 'P08',
    line: 'Purple',
    location: { coordinates: [77.589987, 12.964456] }
  },
  {
    name: 'Sir M Visvesvaraya',
    stationId: 'P09',
    line: 'Purple',
    location: { coordinates: [77.579987, 12.961789] }
  },
  {
    name: 'Majestic (Kempegowda)',
    stationId: 'P10',
    line: 'Purple',
    location: { coordinates: [77.569987, 12.959123] }
  },
  {
    name: 'City Railway Station',
    stationId: 'P11',
    line: 'Purple',
    location: { coordinates: [77.559987, 12.956456] }
  },
  {
    name: 'Magadi Road',
    stationId: 'P12',
    line: 'Purple',
    location: { coordinates: [77.549987, 12.953789] }
  },
  {
    name: 'Hosahalli',
    stationId: 'P13',
    line: 'Purple',
    location: { coordinates: [77.539987, 12.951123] }
  },
  {
    name: 'Vijayanagar',
    stationId: 'P14',
    line: 'Purple',
    location: { coordinates: [77.529987, 12.948456] }
  },
  {
    name: 'Attiguppe',
    stationId: 'P15',
    line: 'Purple',
    location: { coordinates: [77.519987, 12.945789] }
  },
  {
    name: 'Deepanjali Nagar',
    stationId: 'P16',
    line: 'Purple',
    location: { coordinates: [77.509987, 12.943123] }
  },
  {
    name: 'Mysore Road',
    stationId: 'P17',
    line: 'Purple',
    location: { coordinates: [77.499987, 12.940456] }
  },
  
  // Green Line
  {
    name: 'Nagasandra',
    stationId: 'G01',
    line: 'Green',
    location: { coordinates: [77.509987, 13.040456] }
  },
  {
    name: 'Dasarahalli',
    stationId: 'G02',
    line: 'Green',
    location: { coordinates: [77.519987, 13.030456] }
  },
  {
    name: 'Jalahalli',
    stationId: 'G03',
    line: 'Green',
    location: { coordinates: [77.529987, 13.020456] }
  },
  {
    name: 'Peenya Industry',
    stationId: 'G04',
    line: 'Green',
    location: { coordinates: [77.539987, 13.010456] }
  },
  {
    name: 'Peenya',
    stationId: 'G05',
    line: 'Green',
    location: { coordinates: [77.549987, 13.000456] }
  },
  {
    name: 'Goraguntepalya',
    stationId: 'G06',
    line: 'Green',
    location: { coordinates: [77.559987, 12.990456] }
  },
  {
    name: 'Yeshwanthpur',
    stationId: 'G07',
    line: 'Green',
    location: { coordinates: [77.569987, 12.980456] }
  },
  {
    name: 'Sandal Soap Factory',
    stationId: 'G08',
    line: 'Green',
    location: { coordinates: [77.579987, 12.970456] }
  },
  {
    name: 'Mahalakshmi',
    stationId: 'G09',
    line: 'Green',
    location: { coordinates: [77.589987, 12.960456] }
  },
  {
    name: 'Rajajinagar',
    stationId: 'G10',
    line: 'Green',
    location: { coordinates: [77.599987, 12.950456] }
  },
  {
    name: 'Kuvempu Road',
    stationId: 'G11',
    line: 'Green',
    location: { coordinates: [77.609987, 12.940456] }
  },
  {
    name: 'Srirampura',
    stationId: 'G12',
    line: 'Green',
    location: { coordinates: [77.619987, 12.930456] }
  },
  {
    name: 'Mantri Square Sampige Road',
    stationId: 'G13',
    line: 'Green',
    location: { coordinates: [77.629987, 12.920456] }
  },
  {
    name: 'Majestic (Kempegowda)',
    stationId: 'G14',
    line: 'Green',
    location: { coordinates: [77.569987, 12.959123] }
  },
  {
    name: 'Chickpete',
    stationId: 'G15',
    line: 'Green',
    location: { coordinates: [77.579987, 12.949123] }
  },
  {
    name: 'Krishna Rajendra Market',
    stationId: 'G16',
    line: 'Green',
    location: { coordinates: [77.589987, 12.939123] }
  },
  {
    name: 'National College',
    stationId: 'G17',
    line: 'Green',
    location: { coordinates: [77.599987, 12.929123] }
  },
  {
    name: 'Lalbagh',
    stationId: 'G18',
    line: 'Green',
    location: { coordinates: [77.609987, 12.919123] }
  },
  {
    name: 'South End Circle',
    stationId: 'G19',
    line: 'Green',
    location: { coordinates: [77.619987, 12.909123] }
  },
  {
    name: 'Jayanagar',
    stationId: 'G20',
    line: 'Green',
    location: { coordinates: [77.629987, 12.899123] }
  },
  {
    name: 'Rashtreeya Vidyalaya Road',
    stationId: 'G21',
    line: 'Green',
    location: { coordinates: [77.639987, 12.889123] }
  },
  {
    name: 'Banashankari',
    stationId: 'G22',
    line: 'Green',
    location: { coordinates: [77.649987, 12.879123] }
  },
  {
    name: 'Yelachenahalli',
    stationId: 'G23',
    line: 'Green',
    location: { coordinates: [77.659987, 12.869123] }
  },
];

// Function to calculate fare based on distance
const calculateFare = (station1, station2) => {
  // Simple fare calculation based on station IDs
  // In a real system, this would be based on actual distance or zones
  const line1 = station1.stationId.charAt(0);
  const line2 = station2.stationId.charAt(0);
  const id1 = parseInt(station1.stationId.substring(1));
  const id2 = parseInt(station2.stationId.substring(1));
  
  // Base fare
  let fare = 10;
  
  // Same line
  if (line1 === line2) {
    // Add 2 rupees per station difference
    fare += Math.abs(id1 - id2) * 2;
  } else {
    // Different lines (with transfer)
    // Higher base fare for inter-line travel
    fare = 15;
    // Add 2 rupees per station difference
    fare += (Math.abs(id1 - 10) + Math.abs(id2 - 14)) * 2; // Assuming transfer at Majestic
  }
  
  // Cap the maximum fare
  return Math.min(fare, 60);
};

// Seed stations and fares
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Station.deleteMany();
    await Fare.deleteMany();
    
    console.log('Previous data cleared');
    
    // Insert stations
    const createdStations = await Station.insertMany(stations);
    console.log(`${createdStations.length} stations inserted`);
    
    // Create fares between all station pairs
    const fares = [];
    
    for (let i = 0; i < createdStations.length; i++) {
      for (let j = i + 1; j < createdStations.length; j++) {
        const fare = calculateFare(createdStations[i], createdStations[j]);
        
        fares.push({
          fromStation: createdStations[i]._id,
          toStation: createdStations[j]._id,
          fare: fare
        });
      }
    }
    
    // Insert fares
    const createdFares = await Fare.insertMany(fares);
    console.log(`${createdFares.length} fares inserted`);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();