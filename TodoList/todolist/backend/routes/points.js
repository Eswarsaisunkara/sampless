const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getPoints, addPoints } = require("../controllers/pointsController");

router.use(auth);
router.get("/", getPoints);
router.post("/", addPoints);

module.exports = router;
