const express = require("express");
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Browse users (for finding swap partners, with Women Mode filtering)
router.get("/", async (req, res) => {
  try {
    const currentUser = req.user;
    const { role, skill } = req.query;

    // Build filter
    const filter = { _id: { $ne: currentUser._id }, isActive: true };

    if (role) filter.role = role;

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    // ── Women Mode Filter ───────────────────────────────────────────────────
    // If current user has women_mode ON → show ONLY female users
    if (currentUser.women_mode === true) {
      filter.gender = "female";
    }

    // Also hide current user from results where women_mode is ON
    // and the current user is NOT female (extra safety — shouldn't happen
    // since women_mode is blocked for non-females at registration)

    const users = await User.find(filter)
      .select("name email gender role skills location bio women_mode created_at lastLoginAt")
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email gender role skills location bio women_mode created_at lastLoginAt"
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Women mode guard: if viewer has women_mode and target is not female → block
    if (req.user.women_mode === true && user.gender !== "female") {
      return res.status(403).json({
        success: false,
        error: "Women Safe Mode is enabled. You can only view female user profiles.",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── GET /api/users/admin/all ─────────────────────────────────────────────────
// Admin: full user list with all fields
router.get("/admin/all", restrictTo("admin"), async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── PATCH /api/users/:id/deactivate ─────────────────────────────────────────
// Admin: deactivate a user
router.patch("/:id/deactivate", restrictTo("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    res.status(200).json({ success: true, message: "User deactivated.", user: user.toJSON() });
  } catch (err) {
    console.error("Deactivate user error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── PUT /api/users/update-skills ────────────────────────────────────────────────
// Update tutor skills
router.put("/update-skills", async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ success: false, error: "Skills must be an array of strings." });
    }
    
    // Convert to lowercase or keep raw if user prefers, wait, user's example is ["Python", ...]
    const cleanSkills = skills.map(s => s.trim()).filter(s => s.length > 0);
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { skills: cleanSkills },
      { new: true, runValidators: true }
    ).select("-password -__v");
    
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    
    res.status(200).json({ success: true, message: "Skills updated successfully", user });
  } catch (err) {
    console.error("Update skills error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

module.exports = router;
