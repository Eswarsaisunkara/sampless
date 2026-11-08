const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", auth, changePassword);
router.get("/me", auth, getMe);

module.exports = router;
