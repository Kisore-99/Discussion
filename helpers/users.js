const Room = require("../models/Room");
const User = require("../models/User");
const Message = require("../models/Message");
const Notification = require("../models/Notification");

exports.addSocketId = async ({ id, user }) => {
  let updatedUser = await User.updateOne({ userName: user }, { socketId: id });
};

exports.getUser = async id => {
  let user = await User.find({ socketId: id });
  user = user.flat(Infinity);
  let name = user[0].userName;
  return name;
};

exports.getRoom = async roomName => {
  let room = await Room.find({ roomName });
  room = room.flat(Infinity);
  let roomId = room[0]._id;
  return roomId;
};

exports.addMessage = async (userName, message, roomId) => {
  let user = await User.find({ userName });
  user = user[0]._id;
  let msg = Message.insertMany({
    userName,
    senderId: user,
    msg: { msgType: "string", content: message },
    roomId
  });
  return msg;
};

exports.getMessages = async roomId => {
  let userArray = [];
  let msg = await Message.find({ roomId });
  msg.map(m => {
    userArray.push({ user: m.userName, text: m.msg.content });
  });
  return userArray;
};

exports.getRoomName = async roomId => {
  let room = await Room.find({ _id: roomId });
  room = room.flat(Infinity);
  let roomName = room[0].roomName;
  return roomName;
};

exports.getUserName = async _id => {
  let user = await User.find({ _id });
  user = user.flat(Infinity);
  let userName = user[0].userName;
  return userName;
};

exports.addNotification = async (msg, roomId, userId) => {
  let notification = await Notification.insertMany({
    userId,
    notification: { msg, roomId }
  });
};

exports.getNotification = async userId => {
  let notify = await Notification.find({ userId });
  let msgs = [];
  await Promise.all(
    notify.map(n => {
      console.log(n.notification.msg);
      msgs.push({ msg: n.notification.msg, roomId: n.notification.roomId, notificationId: n._id });
    })
  );
  console.log("messages", msgs);
  return msgs;
};
