const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Application');
  console.log('Connected to MongoDB\n');

  const db = mongoose.connection.db;

  // Get all users
  const users = await db.collection('users').find({}).toArray();
  console.log('========== REGISTERED ACCOUNTS ==========');
  console.log(`Total users: ${users.length}\n`);
  users.forEach((u, i) => {
    console.log(`--- User ${i + 1} ---`);
    console.log(`  ID:         ${u._id}`);
    console.log(`  Name:       ${u.first_name || ''} ${u.last_name || ''}`);
    console.log(`  Email:      ${u.email || 'N/A'}`);
    console.log(`  Role:       ${u.role === 2 ? 'Doctor' : 'Simple User'}`);
    console.log(`  Created:    ${u.createdAt || 'N/A'}`);
    console.log('');
  });

  // Get all child records
  const children = await db.collection('childrecords').find({}).toArray();
  console.log('========== CHILD RECORDS ==========');
  console.log(`Total child records: ${children.length}\n`);
  children.forEach((c, i) => {
    console.log(`--- Child ${i + 1} ---`);
    console.log(`  ID:           ${c._id}`);
    console.log(`  Child Name:   ${c['اسم ولقب الطفل:'] || c.childName || 'N/A'}`);
    console.log(`  Specific ID:  ${c.specificId || 'N/A'}`);
    console.log(`  User ID:      ${c.userId || 'N/A'}`);
    console.log(`  Disability:   ${c['نوع اضطراب التعلم:'] || c.disabilityType || 'N/A'}`);
    console.log(`  Mother:       ${c['اسم و لقب الأم:'] || 'N/A'}`);
    console.log(`  Father:       ${c['اسم و لقب الأب:'] || 'N/A'}`);
    console.log(`  Phone:        ${c['الهاتف: '] || 'N/A'}`);
    console.log('');
  });

  await mongoose.disconnect();
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
