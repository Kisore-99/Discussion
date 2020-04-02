const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId
    },
    notification: {
      msg: { type: String },
      roomId: { type: Schema.Types.ObjectId }
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

module.exports = Notification = mongoose.model("notification", notificationSchema);
