const mongoose = require("mongoose");

const SessionLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    login_time: {
      type: Date,
      default: Date.now,
    },
    logout_time: {
      type: Date,
      default: null,
    },
    ip_address: {
      type: String,
      default: "",
    },
    user_agent: {
      type: String,
      default: "",
    },
    activity: {
      type: String,
      enum: ["login", "logout", "register", "password_reset"],
      default: "login",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("SessionLog", SessionLogSchema);
