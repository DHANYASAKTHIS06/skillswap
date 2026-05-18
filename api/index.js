const mongoose = require("mongoose");
const app = require("../server/index.js");

// Connection caching helper to prevent connection starvation in serverless
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  // Check if we are already connected to MongoDB via active mongoose connection
  if (mongoose.connections.length > 0) {
    const state = mongoose.connections[0].readyState;
    if (state === 1) { // 1 = connected
      isConnected = true;
      return;
    }
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing in Vercel configuration");
  }

  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Database connection error in Vercel serverless function:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Database connection failed", 
      details: error.message 
    });
  }

  return app(req, res);
};
