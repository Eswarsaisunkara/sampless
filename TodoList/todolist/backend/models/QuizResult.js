const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    type: { type: String, enum: ["daily", "weekly"], required: true },
    total: { type: Number, required: true },
    correct: { type: Number, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizResult", QuizResultSchema);
