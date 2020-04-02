const mongoose = require("mongoose");

//models
const Room = require("../models/Room");
const User = require("../models/User");
const Notification = require("../models/Notification");

//get rooms
/**
 * this function gets the rooms of a particular workspace
 * @param {ObjectId} _id id of the user
 * @param {string} workspaceName name of the workspace
 * @returns {Array}  rooms
 */
exports.getRooms = async (_id, workspaceName) => {
  try {
    let userRooms = await User.find({ _id });
    userRooms = userRooms[0].roomIds;
    let rooms = await Room.find(
      { isPublic: true },
      { isPublic: true, userIds: { $elemMatch: { $eq: _id } }, _workspaceId: workspaceName }
    );
    let difference = rooms.filter(x => !userRooms.includes(x._id)).map(d => d._id);
    if (difference.length > 0) {
      updatedUser = await User.updateOne({ _id }, { $push: { roomIds: difference } });
      userRooms = await User.find({ _id });
      userRooms = userRooms[0].roomIds;
      let updatedRoom;
      await Promise.all(
        difference.map(async room => {
          updatedRoom = await Room.updateOne({ _id: room }, { $push: { userIds: _id } });
        })
      );
    }
    userRooms = await User.find({ _id });
    userRooms = userRooms[0].roomIds;
    console.log("userRooms", userRooms);
    let foundRooms = await Promise.all(
      userRooms.map(async u => {
        return await Room.find({ workspaceId: workspaceName, _id: u });
      })
    );
    console.log(foundRooms);
    return foundRooms.flat(Infinity);
  } catch (err) {
    return {
      message: "loadng rooms failed"
    };
  }
};

//create room
/**
 * this function creates a new room
 * @param {string} workspaceName name of the workspace
 * @param {ObjectId} userId id of the user
 * @param {string} roomName name of the room
 * @param {boolean} isPublic public room or private room
 * @returns {Array}  updated rooms
 */
exports.createRoom = async newRoom => {
  try {
    let userIds = [];
    let room = await Room.find({ roomName: newRoom.roomName });
    if (room.length > 0) {
      return {
        message: "Room name already exists"
      };
    }

    let users = await User.find(
      {},
      { workspaceIds: { $elemMatch: { $eq: newRoom.workspaceName } } }
    );
    userIds = users.map(u => u._id);
    let newRoomId = new mongoose.Types.ObjectId();

    if (!newRoom.isPublic) {
      let insertedRoom = await Room.insertMany({
        _id: newRoomId,
        workspaceId: newRoom.workspaceName,
        roomName: newRoom.roomName,
        isPublic: newRoom.isPublic,
        userIds: newRoom.userId,
        createdBy: newRoom.userId
      });
      roomUserIds = insertedRoom[0].userIds;
    } else {
      let insertedRoom = await Room.insertMany({
        _id: newRoomId,
        workspaceId: newRoom.workspaceName,
        roomName: newRoom.roomName,
        isPublic: newRoom.isPublic,
        userIds,
        createdBy: newRoom.userId
      });
      roomUserIds = insertedRoom[0].userIds;
    }
    await Promise.all(
      roomUserIds.map(r =>
        User.updateOne({ _id: mongoose.Types.ObjectId(r) }, { $push: { roomIds: newRoomId } })
      )
    );

    userRooms = await User.find({ _id: newRoom.userId });
    userRooms = userRooms[0].roomIds;
    let foundRooms = await Promise.all(
      userRooms.map(async u => {
        return await Room.find({ workspaceId: newRoom.workspaceName, _id: u });
      })
    );
    return foundRooms.flat(Infinity);
  } catch (err) {
    return {
      message: "Creating new room failed!"
    };
  }
};

//delete a room
/**
 * this function deletes a new room
 * @param {string} workspaceId id of the workspace
 * @param {ObjectId} creatorId id of the user
 * @param {ObjectId} roomId id of the room
 * @returns {Array}  remaining rooms
 */
exports.deleteRoom = async delRoom => {
  try {
    let room = await Room.find({ _id: delRoom.roomId, createdBy: delRoom.creatorId });
    let Ids = room[0].userIds;
    await Room.deleteOne({ _id: delRoom.roomId });
    let found = await Promise.all(
      Ids.map(async u => {
        return await User.findByIdAndUpdate(u, {
          $pull: { roomIds: mongoose.Types.ObjectId(delRoom.roomId) }
        });
      })
    );
    userRooms = await User.find({ _id: delRoom.creatorId });
    userRooms = userRooms[0].roomIds;
    let foundRooms = await Promise.all(
      userRooms.map(async u => {
        return await Room.find({ workspaceId: delRoom.workspaceId, _id: u });
      })
    );
    return foundRooms.flat(Infinity);
  } catch (err) {
    return {
      message: "Deleting a room failed!"
    };
  }
};

//join private room
/**
 * this function joins user to the room
 * @param {ObjectId} userId id of the user
 * @param {ObjectId} roomId id of the room
 * @param {string} workspaceName name of the workspace
 * @returns {Array}  updated rooms
 */
exports.joinRoom = async (userId, roomId, workspaceName) => {
  updatedRoom = await Room.updateOne(
    { _id: roomId, workspaceId: workspaceName },
    { $push: { userIds: mongoose.Types.ObjectId(userId) } }
  );
  updatedUser = await User.updateOne(
    { _id: userId },
    { $push: { roomIds: mongoose.Types.ObjectId(roomId) } }
  );
  userRooms = await User.find({ _id: userId });
  userRooms = userRooms[0].roomIds;
  let foundRooms = await Promise.all(
    userRooms.map(async u => {
      return await Room.find({ workspaceId: workspaceName, _id: u });
    })
  );

  return foundRooms.flat(Infinity);
};

/**
 * this function deletes the accepted notification
 * @param {ObjectId} notificationId id of the notification
 * @returns {Array}  remaining notifications
 */
exports.deleteNotification = async notificationId => {
  console.log("notifyId", notificationId);
  const val = await Notification.deleteOne({
    _id: notificationId
  });
  console.log("val", val);
  let remainingNotifications = await Notification.find({});
  console.log("remaining notify", remainingNotifications);
  return remainingNotifications.flat(Infinity);
};
