const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://mongo:27017/Application";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connecté (Docker)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};

module.exports = connectDB;
