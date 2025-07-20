const mongoose = require('mongoose');
require('dotenv').config();

// Import the Visitor model
const Visitor = require('./models/Visitor');

async function cleanupVisitors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Remove all visitor records older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const deleteResult = await Visitor.deleteMany({
      createdAt: { $lt: oneHourAgo }
    });
    console.log(`Deleted ${deleteResult.deletedCount} old records`);

    // Remove duplicate records from the same session within 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicates = await Visitor.aggregate([
      {
        $match: {
          createdAt: { $gte: fiveMinutesAgo }
        }
      },
      {
        $group: {
          _id: {
            sessionId: '$sessionId',
            page: '$page'
          },
          count: { $sum: 1 },
          docs: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    let duplicateDeletions = 0;
    for (const duplicate of duplicates) {
      // Keep the first record, delete the rest
      const toDelete = duplicate.docs.slice(1);
      if (toDelete.length > 0) {
        await Visitor.deleteMany({ _id: { $in: toDelete } });
        duplicateDeletions += toDelete.length;
      }
    }
    console.log(`Deleted ${duplicateDeletions} duplicate records`);

    // Show remaining records
    const remainingRecords = await Visitor.countDocuments();
    console.log(`Remaining records: ${remainingRecords}`);

    // Show recent visits
    const recentVisits = await Visitor.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('ip sessionId page createdAt');
    
    console.log('\nRecent visits:');
    recentVisits.forEach(visit => {
      console.log(`${visit.ip} - ${visit.page} - ${visit.createdAt}`);
    });

    console.log('\nCleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupVisitors(); 