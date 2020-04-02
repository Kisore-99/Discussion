const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkspaceSchema = new Schema(
  {
    workspaceName: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {}
  }
);

module.exports = Workspace = mongoose.model("workspace", WorkspaceSchema);
