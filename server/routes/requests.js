const express = require("express");
const Request = require("../models/Request");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All request routes require auth
router.use(protect);

// ─── POST /api/requests ───────────────────────────────────────────────────────
// Send a new skill swap request
router.post("/", async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiver_id, message, student_year } = req.body;

    if (!receiver_id) {
      return res.status(400).json({
        success: false,
        error: "receiver_id is required.",
      });
    }

    // Cannot send request to yourself
    if (senderId.toString() === receiver_id) {
      return res.status(400).json({
        success: false,
        error: "You cannot send a request to yourself.",
      });
    }

    // Check receiver exists
    const receiver = await User.findById(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        error: "Receiver user not found.",
      });
    }

    // ── Women Mode Guard ────────────────────────────────────────────────────
    // If receiver has women_mode ON, only female users can send them requests
    if (receiver.women_mode === true && req.user.gender !== "female") {
      return res.status(403).json({
        success: false,
        error: "This user has Women Safe Mode enabled. Only female users can interact with them.",
      });
    }

    // If SENDER has women_mode ON, they can only send to female receivers
    if (req.user.women_mode === true && receiver.gender !== "female") {
      return res.status(403).json({
        success: false,
        error: "You have Women Safe Mode enabled. You can only send requests to female users.",
      });
    }
    // ─────────────────────────────────────────────────────────────────────

    // Check for an existing pending request between same users for same skill
    const alreadyPending = await Request.findOne({
      sender_id: senderId,
      receiver_id,
      status: "pending",
    });
    if (alreadyPending) {
      return res.status(409).json({
        success: false,
        error: "You already have a pending request to this user.",
      });
    }

    const request = await Request.create({
      sender_id: senderId,
      receiver_id,
      message: (message || "").trim(),
      student_year: (student_year || "").trim(),
    });

    // Populate sender/receiver details for response
    const populated = await Request.findById(request._id)
      .populate("sender_id", "name email gender role")
      .populate("receiver_id", "name email gender role");

    res.status(201).json({ success: true, request: populated });
  } catch (err) {
    console.error("Send request error:", err);
    res.status(500).json({ success: false, error: "Server error. Please try again." });
  }
});

// ─── GET /api/requests/sent ───────────────────────────────────────────────────
// Fetch all requests sent BY current user
router.get("/sent", async (req, res) => {
  try {
    const requests = await Request.find({ sender_id: req.user._id })
      .populate("receiver_id", "name email gender role skills location")
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    console.error("Fetch sent error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── GET /api/requests/received ──────────────────────────────────────────────
// Fetch all requests received BY current user
router.get("/received", async (req, res) => {
  try {
    const requests = await Request.find({ receiver_id: req.user._id })
      .populate("sender_id", "name email gender role skills location")
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    console.error("Fetch received error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── GET /api/requests/all ───────────────────────────────────────────────────
// Admin: all requests
router.get("/all", async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Admin only." });
    }

    const { status } = req.query;
    const filter = status ? { status } : {};

    const requests = await Request.find(filter)
      .populate("sender_id", "name email gender role")
      .populate("receiver_id", "name email gender role")
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    console.error("Fetch all requests error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── PATCH /api/requests/:id/accept ─────────────────────────────────────────
// Accept a request (receiver only)
router.patch("/:id/accept", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Request not found." });
    }

    // Only the RECEIVER can accept
    if (request.receiver_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the receiver can accept a request.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: `Request is already ${request.status}.`,
      });
    }

    request.status = "accepted";
    request.responded_at = new Date();
    await request.save();

    const populated = await Request.findById(request._id)
      .populate("sender_id", "name email gender role")
      .populate("receiver_id", "name email gender role");

    res.status(200).json({ success: true, request: populated });
  } catch (err) {
    console.error("Accept request error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── PATCH /api/requests/:id/reject ─────────────────────────────────────────
// Reject a request (receiver only)
router.patch("/:id/reject", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Request not found." });
    }

    // Only the RECEIVER can reject
    if (request.receiver_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the receiver can reject a request.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: `Request is already ${request.status}.`,
      });
    }

    request.status = "rejected";
    request.responded_at = new Date();
    await request.save();

    const populated = await Request.findById(request._id)
      .populate("sender_id", "name email gender role")
      .populate("receiver_id", "name email gender role");

    res.status(200).json({ success: true, request: populated });
  } catch (err) {
    console.error("Reject request error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

// ─── DELETE /api/requests/:id ────────────────────────────────────────────────
// Cancel / withdraw a request (sender only, if still pending)
router.delete("/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: "Request not found." });
    }

    if (request.sender_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the sender can cancel a request.",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending requests can be cancelled.",
      });
    }

    await request.deleteOne();
    res.status(200).json({ success: true, message: "Request cancelled." });
  } catch (err) {
    console.error("Cancel request error:", err);
    res.status(500).json({ success: false, error: "Server error." });
  }
});

module.exports = router;
