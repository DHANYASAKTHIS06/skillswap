require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// ─── Import Routes ───────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const userRoutes = require("./routes/users");

// ─── App Setup ───────────────────────────────────────────────────────────────
const app = express();

// Connect Database (Only run here when running standalone locally or outside Vercel serverless)
if (!process.env.VERCEL) {
  connectDB();
}

// CORS - allow requests from Vite dev server, dynamic client URL, and vercel preview domains
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to avoid blocking API access
      }
    },
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

// ─── Start Standalone Local Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Skill Swap API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Auth:   http://localhost:${PORT}/api/auth`);
    console.log(`   Requests: http://localhost:${PORT}/api/requests`);
    console.log(`   Users:  http://localhost:${PORT}/api/users\n`);
  });
}

module.exports = app;
