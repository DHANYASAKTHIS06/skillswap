require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const mongoose = require("mongoose");

// ─── Import Routes ───────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/users");

// ─── App Setup ───────────────────────────────────────────────────────────────
const app = express();

// ─── Debug Environment Variables ─────────────────────────────────────────────
console.log("\n🔍 Environment Check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("VERCEL:", process.env.VERCEL);
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI
    ? process.env.MONGODB_URI.substring(0, 40) + "..."
    : "❌ NOT FOUND"
);

// ─── Connect Database ────────────────────────────────────────────────────────
const initializeDatabase = async () => {
  try {
    await connectDB();

    console.log("✅ Database initialization successful");

    // Test MongoDB connection
    await mongoose.connection.db.admin().ping();
    console.log("✅ MongoDB ping successful");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
  }
};

// Always initialize DB (important for Vercel)
initializeDatabase();

// ─── CORS Configuration ──────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost + vercel domains
      if (
        allowedOrigins.includes(origin) ||
        origin.includes(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.warn("⚠ Blocked CORS origin:", origin);

      // Fallback allow
      return callback(null, true);
    },
    credentials: true,
  })
);

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  let dbStatus = "Disconnected";

  try {
    if (mongoose.connection.readyState === 1) {
      dbStatus = "Connected";
    }

    res.json({
      success: true,
      message: "Skill Swap API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: dbStatus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ─── MongoDB Test Route ──────────────────────────────────────────────────────
app.get("/api/testdb", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();

    res.json({
      success: true,
      message: "✅ MongoDB connection working",
    });
  } catch (err) {
    console.error("❌ MongoDB test failed:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error.",
  });
});

// ─── Start Standalone Local Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Skill Swap API running on http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/api/health`);
    console.log(`   Test DB:  http://localhost:${PORT}/api/testdb`);
    console.log(`   Auth:     http://localhost:${PORT}/api/auth`);
    console.log(`   Requests: http://localhost:${PORT}/api/requests`);
    console.log(`   Users:    http://localhost:${PORT}/api/users\n`);
  });
}

module.exports = app;