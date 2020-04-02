const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    userName: {
      type: String
    },
    senderId: {
      type: Schema.Types.ObjectId
    },
    msg: {
      msgType: { type: String },
      content: { type: String }
    },
    roomId: {
      type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: {}
  }
);

module.exports = Message = mongoose.model("message", messageSchema);
