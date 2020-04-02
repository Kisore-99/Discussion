const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    roomName: {
      type: String
    },
    isPublic: {
      type: Boolean
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users"
    },
    numOfMem: {
      type: Number
    },
    userIds: { type: Array, default: [] },
    workspaceId: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

module.exports = Room = mongoose.model("room", roomSchema);
