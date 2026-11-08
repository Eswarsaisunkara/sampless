const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getAll, markRead, markAllRead, clearAll } = require("../controllers/notificationController");

router.use(auth);
router.get("/", getAll);
router.put("/:id/read", markRead);
router.put("/read-all", markAllRead);
router.delete("/clear-all", clearAll);

module.exports = router;
