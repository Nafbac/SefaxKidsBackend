const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/Application');
  const db = mongoose.connection.db;
  const result = await db.collection('childrecords').updateMany(
    { userId: 'mock_user_id' },
    { $set: { userId: '69a1cf17c53228b9e50c0de2' } }
  );
  console.log('Updated ' + result.modifiedCount + ' records');
  await mongoose.disconnect();
}

run().catch(console.dir);
