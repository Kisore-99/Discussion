const jwt = require("jsonwebtoken");
const { secret } = require("../config");

//models
const User = require("../models/User");

/**
 * this function logs user into the workspace
 * @param {string} emailid emailid of the user
 * @param {string} workspaceId workspaceid of the user
 * @returns {object}  token
 */
exports.loginRoom = async (emailId, workspaceName, res) => {
  try {
    let result;
    let user = await User.aggregate([
      { $match: { emailId } },
      { $match: { workspaceIds: { $elemMatch: { $eq: workspaceName } } } }
    ]);
    if (!user) {
      return res.send("user does not exist");
    }
    jwt.sign({ id: user[0]._id }, secret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      result = { token, user: user.flat(Infinity) };
      res.send(result);
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

/**
 * this function gets the users of specified room of a particular workspace
 * @param {string} workspaceName name of the workspace
 * @param {ObjectId} roomId id of the room of the given workspace
 * @returns {Array}  users array
 */
exports.getUsers = async (workspaceName, roomId) => {
  console.log(roomId);
  try {
    let users = await User.find({ workspaceIds: { $elemMatch: { $eq: workspaceName } } });
    let roomUsers = await Room.find({
      _id: roomId
    });
    roomUsers = roomUsers[0].userIds;
    let difference = users.filter(x => !roomUsers.includes(x._id)).map(d => d._id);
    let foundUsers = await Promise.all(
      difference.map(async u => {
        return await User.find({ _id: u });
      })
    );
    console.log("difference", difference);
    console.log(foundUsers.flat(Infinity));
    return foundUsers.flat(Infinity);
  } catch (err) {
    return {
      message: "Loading users failed"
    };
  }
};
