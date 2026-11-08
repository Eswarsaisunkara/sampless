const Notification = require("../models/Notification");

exports.getAll = async (req, res, next) => {
  try {
    const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  } catch (err) {
    next(err);
  }
};

exports.create = async (data) => {
  return Notification.create({ user: data.userId, title: data.title, body: data.body, type: data.type });
};

exports.markRead = async (req, res, next) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Not found" });
    res.json(notif);
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { read: true });
    const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    next(err);
  }
};

exports.clearAll = async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json([]);
  } catch (err) {
    next(err);
  }
};
