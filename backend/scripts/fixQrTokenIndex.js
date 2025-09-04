const { MongoClient } = require('mongodb');
require('dotenv').config();

async function dropQrTokenIndex() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/namma-tapngo';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('namma-tapngo');
    const usersCollection = database.collection('users');

    // Get all indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);

    // Find and drop the qrToken index if it exists
    const qrTokenIndex = indexes.find(index => 
      index.name === 'qrToken_1' || 
      (index.key && index.key.qrToken !== undefined));

    if (qrTokenIndex) {
      console.log('Found qrToken index, dropping it...');
      await usersCollection.dropIndex(qrTokenIndex.name);
      console.log('Successfully dropped qrToken index');
    } else {
      console.log('No qrToken index found');
    }

    // Verify indexes after dropping
    const updatedIndexes = await usersCollection.indexes();
    console.log('Updated indexes:', updatedIndexes);

    console.log('Index fix completed successfully');
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
dropQrTokenIndex();