require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ─── Import Routes ───────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/users");

// ─── App Setup ───────────────────────────────────────────────────────────────
const app = express();

// CORS - allow requests from the Vite dev server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Skill Swap API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error.",
  });
});

// ─── Connect to MongoDB & Start Server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skillswap";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB:", MONGODB_URI.replace(/\/\/.*@/, "//***@"));
    console.log("   Database: skillswap");
    console.log("   Collections: users, requests, sessionlogs");

    app.listen(PORT, () => {
      console.log(`\n🚀 Skill Swap API running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/health`);
      console.log(`   Auth:   http://localhost:${PORT}/api/auth`);
      console.log(`   Requests: http://localhost:${PORT}/api/requests`);
      console.log(`   Users:  http://localhost:${PORT}/api/users\n`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   Please check your MONGODB_URI in server/.env");
    process.exit(1);
  });

module.exports = app;
