const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getResults, submitResult } = require("../controllers/quizController");

router.use(auth);
router.get("/", getResults);
router.post("/", submitResult);

module.exports = router;
