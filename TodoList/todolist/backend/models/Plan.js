const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    hours: { type: Number, default: 1 },
    color: { type: String, default: "#6366f1" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", PlanSchema);
