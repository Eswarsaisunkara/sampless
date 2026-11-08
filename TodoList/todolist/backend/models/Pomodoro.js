const mongoose = require("mongoose");

const PomodoroSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    duration: { type: Number, required: true },
    subject: { type: String, default: "General" },
    type: { type: String, enum: ["work", "break"], default: "work" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pomodoro", PomodoroSchema);
