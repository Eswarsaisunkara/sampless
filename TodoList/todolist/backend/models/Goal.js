const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["daily", "weekly", "monthly"], default: "daily" },
    target: { type: Number, required: true, min: 1 },
    progress: { type: Number, default: 0 },
    unit: { type: String, default: "hours" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);
