const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SessionLog = require("../models/SessionLog");
const { protect } = require("../middleware/auth");

const router = express.Router();

// ─── Helper: sign JWT ────────────────────────────────────────────────────────
function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, gender, women_mode } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required.",
      });
    }

    // Women mode validation: only female users can enable women_mode
    if (women_mode === true && gender !== "female") {
      return res.status(400).json({
        success: false,
        error: "Women Safe Mode can only be enabled by female users.",
      });
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists. Please sign in instead.",
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || "student",
      gender: gender || "other",
      women_mode: gender === "female" ? !!women_mode : false,
    });

    // Log registration
    await SessionLog.create({
      user_id: user._id,
      activity: "register",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"] || "",
    });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "An account with this email already exists.",
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(". ") });
    }
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Server error. Please try again." });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "No account found with this email. Please create an account first.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password. Please try again.",
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Log login
    await SessionLog.create({
      user_id: user._id,
      activity: "login",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"] || "",
    });

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server error. Please try again." });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user.toJSON(),
  });
});

// ─── PATCH /api/auth/profile ──────────────────────────────────────────────────
router.patch("/profile", protect, async (req, res) => {
  try {
    const allowed = ["name", "skills", "location", "bio", "women_mode"];
    const updates = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Women mode can only be set by female users
    if (updates.women_mode === true && req.user.gender !== "female") {
      return res.status(403).json({
        success: false,
        error: "Women Safe Mode can only be enabled by female users.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, user: user.toJSON() });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, error: "Server error. Please try again." });
  }
});

// ─── POST /api/auth/logout ───────────────────────────────────────────────────
router.post("/logout", protect, async (req, res) => {
  try {
    await SessionLog.create({
      user_id: req.user._id,
      activity: "logout",
      ip_address: req.ip,
      user_agent: req.headers["user-agent"] || "",
    });
    res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

module.exports = router;
