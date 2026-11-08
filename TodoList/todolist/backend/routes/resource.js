const express = require("express");
const auth = require("../middleware/auth");
const { createOne, getAll, getOne, updateOne, deleteOne } = require("../controllers/resourceController");

module.exports = (Model) => {
  const router = express.Router();
  router.use(auth);
  router.route("/").get(getAll(Model)).post(createOne(Model));
  router.route("/:id").get(getOne(Model)).put(updateOne(Model)).delete(deleteOne(Model));
  return router;
};
