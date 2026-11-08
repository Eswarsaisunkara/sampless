const QuizResult = require("../models/QuizResult");
const Points = require("../models/Points");
const Notification = require("../models/Notification");

exports.getResults = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(results);
  } catch (err) {
    next(err);
  }
};

exports.submitResult = async (req, res, next) => {
  try {
    const { topic, type, total, correct, score } = req.body;
    const result = await QuizResult.create({
      user: req.user._id,
      topic,
      type,
      total,
      correct,
      score,
    });

    // Award points
    const earned = correct * 5 + 20; // 5 per correct + 20 completion bonus
    let points = await Points.findOne({ user: req.user._id });
    if (!points) points = new Points({ user: req.user._id, total: 0, history: [] });
    points.total += earned;
    points.history.unshift({ amount: earned, reason: `${topic} ${type} quiz: ${correct}/${total}` });
    await points.save();

    // Create notification
    await Notification.create({
      user: req.user._id,
      title: `Quiz complete! +${earned} pts 🎉`,
      body: `${topic} ${type}: ${correct}/${total} correct`,
      type: "quiz",
    });

    res.status(201).json({ result, earned, pointsTotal: points.total });
  } catch (err) {
    next(err);
  }
};
