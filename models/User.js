const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true
    },
    emailId: {
      type: String,
      required: true
    },
    socketId: {
      type: String
    },
    roomIds: { type: Array, default: [] },
    workspaceIds: { type: Array, default: [] }
  },
  {
    timestamps: {
      createdAt: "joinedAt",
      updatedAt: "updatedAt"
    }
  }
);

module.exports = User = mongoose.model("users", userSchema);
