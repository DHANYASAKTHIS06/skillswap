const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
      maxlength: [1000, "Message must be under 1000 characters"],
      trim: true,
    },
    // Extra metadata (optional)
    student_year: {
      type: String,
      default: "",
      trim: true,
    },
    responded_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Prevent duplicate pending requests between same pair
RequestSchema.index(
  { sender_id: 1, receiver_id: 1, status: 1 },
  {
    unique: false, // allow multiple (e.g. after rejection you can re-request)
  }
);

module.exports = mongoose.model("Request", RequestSchema);
