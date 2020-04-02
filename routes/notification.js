const express = require("express");
const router = express.Router();

const { getNotifications } = require("../controllers/notification");

router.get("/", async (req, res) => {
  let userId = req.query._id;
  let messages = await getNotifications(userId);
  console.log("messages", messages);
  res.send(messages);
});

module.exports = router;
