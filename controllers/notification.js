const mongoose = require("mongoose");

const Notification = require("../models/Notification");

/**
 * this function fetches the notifications
 * @param {ObjectId} userId id of the user
 * @returns {Array}  notifications
 */
exports.getNotifications = async userId => {
  let notify = await Notification.find({ userId });
  let msgs = [];
  await Promise.all(
    notify.map(n => {
      console.log(n.notification.msg);
      msgs.push({ msg: n.notification.msg, roomId: n.notification.roomId, notificationId: n._id });
    })
  );
  return msgs;
};
