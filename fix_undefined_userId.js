const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/Application');
  const db = mongoose.connection.db;
  
  // Assign all orphan records (userId undefined or null) to the Simple User
  const result = await db.collection('childrecords').updateMany(
    { $or: [{ userId: { $exists: false } }, { userId: undefined }, { userId: null }] },
    { $set: { userId: '699a69d084fd1ae9f0c54081' } }
  );
  
  console.log('Fixed ' + result.modifiedCount + ' records that had missing user IDs.');
  await mongoose.disconnect();
}

run().catch(console.dir);
