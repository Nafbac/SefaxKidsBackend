const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const neo4j = require('neo4j-driver');
const { User } = require('./Models/user');
const ChildRecord = require('./Models/ChildRecord1');

const MONGODB_URI = 'mongodb://localhost:27017/Application';
const NEO4J_URI = 'bolt://localhost:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'password';

const neo4jDriver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

const simulatedChildren = [
    { name: "Ali", email: "ali@test.com", password: "password123", role: 1 },
    { name: "Mona", email: "mona@test.com", password: "password123", role: 1 },
    { name: "Sami", email: "sami@test.com", password: "password123", role: 1 },
    { name: "Rana", email: "rana@test.com", password: "password123", role: 1 },
    { name: "Tarek", email: "tarek@test.com", password: "password123", role: 1 },
    { name: "Hala", email: "hala@test.com", password: "password123", role: 1 },
    { name: "Adel", email: "adel@test.com", password: "password123", role: 1 },
    { name: "Nada", email: "nada@test.com", password: "password123", role: 1 },
    { name: "Fadi", email: "fadi@test.com", password: "password123", role: 1 },
    { name: "Lina", email: "lina@test.com", password: "password123", role: 1 }
];

async function seedData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB.");

        const session = neo4jDriver.session();
        console.log("Connected to Neo4j.");

        for (const child of simulatedChildren) {
            // 1. Create MongoDB User
            const hashedPassword = await bcrypt.hash(child.password, 10);
            const user = new User({
                first_name: child.name,
                last_name: "Test",
                email: child.email,
                password: hashedPassword,
                role: child.role
            });

            await user.save();
            const userId = user._id.toString();
            console.log(`Saved ${child.name} to MongoDB. ID: ${userId}`);

            // 2. Create MongoDB ChildRecord Form
            const childRecord = new ChildRecord({
                userId: userId, // Explicitly linking the child record to the user
                'اسم ولقب الطفل:': child.name + " Test",
                'تاريخ ميلاد الطفل :': '2016-05-10',
                'اسم و لقب الأم:': 'Mother Test',
                'المستوى التعليمي للأم:': 'University',
                'مهنة الأم :': 'Teacher',
                'الهاتف: ': '12345678',
                'المستوى الدراسي:': '2nd Grade',
                'المعدل:': '12/20',
                'نوع اضطراب التعلم:': 'Dyslexia'
            });

            await childRecord.save();
            console.log(`Created Child Record Form for ${child.name}.`);

            // 3. Sync to Neo4j
            await session.run(
                "MERGE (u:User {id: $id, email: $email, name: $name, role: 'Child'})",
                {
                    id: userId,
                    email: child.email,
                    name: child.name + " Test"
                }
            );
            console.log(`Synced ${child.name} to Neo4j.`);
            console.log("-----------------------------------------");
        }

        await session.close();
        await neo4jDriver.close();
        await mongoose.disconnect();
        
        console.log("All 10 simulated users and child forms created successfully!");
        console.log("\n--- ACCOUNTS ---");
        simulatedChildren.forEach(c => {
            console.log(`Email: ${c.email} | Password: ${c.password}`);
        });

    } catch (e) {
        console.error("Seeding error:", e);
    }
}

seedData();
