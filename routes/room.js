const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Logger = require("../config/logger");
const logger = new Logger("app");

//controllers
const {
  getRooms,
  createRoom,
  deleteRoom,
  joinRoom,
  deleteNotification
} = require("../controllers/room");

//insert rooms
router.post("/", (req, res) => {
  Room.insertMany(rooms, (err, docs) => {
    res.send(docs);
  });
});

//get the rooms
router.get("/", async (req, res) => {
  //adding body ad log data
  let workspaceName = req.query.workspaceName;
  let _id = req.query._id;
  console.log(workspaceName);
  console.log(_id);
  let rooms = await getRooms(_id, workspaceName);

  res.send(rooms);
});

//create a new room
router.post("/create", async (req, res) => {
  const body = req.body;
  logger.setLogData(body);
  logger.info("Request received at /room/create", req.body);
  let newRoom = {
    workspaceName: req.body.workspaceName,
    userId: req.body.userId,
    roomName: req.body.roomName,
    isPublic: req.body.isPublic
  };
  let rooms = await createRoom(newRoom);
  res.send(rooms);
});

//delete an existing room
router.post("/delete", async (req, res) => {
  const body = req.body;
  logger.setLogData(body);
  logger.info("Request received at /room/delete", req.body);
  let delRoom = {
    workspaceId: req.body.workspaceId,
    creatorId: req.body.userId,
    roomId: req.body.roomId
  };
  let rooms = await deleteRoom(delRoom);
  res.send(rooms);
});

//join private room
router.post("/join", async (req, res) => {
  const body = req.body;
  logger.setLogData(body);
  logger.info("Request received at /room/join", req.body);
  let userId = req.body.userId;
  let roomId = req.body.roomId;
  let workspaceName = req.body.workspaceName;
  let notificationId = req.body.notificationId;
  console.log(notificationId);
  let rooms = await joinRoom(userId, roomId, workspaceName);
  let notifications = await deleteNotification(notificationId);
  console.log("rooms", rooms);
  res.send({ rooms, notifications });
});

module.exports = router;
