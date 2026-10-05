const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Application');
  const db = mongoose.connection.db;

  const user = await db.collection('users').findOne({ email: 'nafedbaccar@gmail.com' });
  if (user) {
    console.log('=== User found ===');
    console.log('  ID:    ', user._id.toString());
    console.log('  Name:  ', user.first_name, user.last_name);
    console.log('  Email: ', user.email);
    console.log('  Role:  ', user.role, '(type:', typeof user.role + ')');
    console.log('  Password hash:', user.password);
  } else {
    console.log('User NOT found!');
  }

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
