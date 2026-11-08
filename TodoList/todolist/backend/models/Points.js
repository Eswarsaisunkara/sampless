const mongoose = require("mongoose");

const PointsHistorySchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PointsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    total: { type: Number, default: 0 },
    history: [PointsHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Points", PointsSchema);
