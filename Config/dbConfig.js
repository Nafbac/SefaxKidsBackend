const mongoose = require("mongoose");
const fs = require("fs");

/**
 * Detect runtime environment:
 * - Railway: Automatically provides RAILWAY_ENVIRONMENT, RAILWAY_SERVICE_ID, etc.
 * - Docker: Has /.dockerenv file or DOCKER_ENV variable
 * - Local: Normal local development on host machine
 */
const isRailway = Boolean(
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_SERVICE_ID ||
  process.env.RAILWAY_PROJECT_ID
);

const isDocker = Boolean(
  process.env.DOCKER_ENV ||
  fs.existsSync("/.dockerenv")
);

const getMongoConfig = () => {
  // 1. If explicit URI is provided in environment variables (.env, Railway Variables, or Docker)
  // Check both MONGODB_URI and MONGO_URL (Railway MongoDB plugin default)
  const envUri = process.env.MONGODB_URI || process.env.MONGO_URL;

  if (envUri) {
    const envSource = isRailway ? "Railway Variable" : "Environment (.env)";
    return {
      uri: envUri,
      environment: isRailway ? "Railway" : isDocker ? "Docker" : "Local",
      source: envSource,
    };
  }

  // 2. Railway environment but no URI was configured
  if (isRailway) {
    throw new Error(
      "❌ Running on Railway, but neither MONGODB_URI nor MONGO_URL was found. " +
      "Please create a MongoDB service in Railway and link MONGODB_URI in your backend Variables."
    );
  }

  // 3. Docker container environment (fallback if no MONGODB_URI specified)
  if (isDocker) {
    return {
      uri: "mongodb://mongo:27017/Application",
      environment: "Docker",
      source: "Docker Network Default",
    };
  }

  // 4. Local machine development (fallback)
  return {
    uri: "mongodb://127.0.0.1:27017/Application",
    environment: "Local Machine",
    source: "Localhost Default",
  };
};

const connectDB = async () => {
  try {
    const { uri, environment, source } = getMongoConfig();

    console.log(`📡 Environment: ${environment} (${source})`);
    console.log(`⏳ Connecting to MongoDB...`);

    await mongoose.connect(uri);

    console.log(`✅ MongoDB connected successfully [${environment}]`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    if (isRailway) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

