const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "studyos_secret_key_2026");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Token is valid but user no longer exists" });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired, please sign in again" });
    if (err.name === "JsonWebTokenError") return res.status(401).json({ message: "Invalid token" });
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = auth;
