const Points = require("../models/Points");

exports.getPoints = async (req, res, next) => {
  try {
    let points = await Points.findOne({ user: req.user._id });
    if (!points) {
      points = await Points.create({ user: req.user._id, total: 0, history: [] });
    }
    res.json(points);
  } catch (err) {
    next(err);
  }
};

exports.addPoints = async (req, res, next) => {
  try {
    const { amount, reason } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Amount must be positive" });

    let points = await Points.findOne({ user: req.user._id });
    if (!points) points = new Points({ user: req.user._id, total: 0, history: [] });

    points.total += amount;
    points.history.unshift({ amount, reason: reason || "Earned" });
    points.history = points.history.slice(0, 50);
    await points.save();
    res.json(points);
  } catch (err) {
    next(err);
  }
};
