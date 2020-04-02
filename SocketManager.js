const io = require("./server").io;

//getting helpers
const {
  addSocketId,
  getUser,
  getRoom,
  getRoomName,
  getUserName,
  addMessage,
  getMessages,
  addNotification,
  getNotification
} = require("./helpers/users");

module.exports = function(socket) {
  //joining the room

  let roomName;
  let workspace;

  //entering workspace
  socket.on("enterWorkspace", async ({ workspaceName, _id }, callback) => {
    console.log("workpsaceName:", workspaceName);
    workspace = workspaceName;
    socket.join(workspaceName);

    // callback();
  });

  //entering into chat room
  socket.on("enterRoom", async ({ user, room }, callback) => {
    await addSocketId({ id: socket.id, user });
    console.log("user", user);
    console.log("room", room);
    roomName = room;
    let roomId = await getRoom(roomName);
    console.log("entered room", room);
    socket.join(roomId);

    //gets the chat history from DB
    let chat = await getMessages(roomId);
    console.log("chat", chat);
    io.to(roomId).emit("chatHistory", chat);
    callback();
  });

  //listener for sending message
  socket.on("sendMessage", async (message, callback) => {
    let name = await getUser(socket.id);
    let roomId = await getRoom(roomName);
    let msg = await addMessage(name, message, roomId);
    io.to(roomId).emit("message", { user: name, text: message });

    socket.on("notificationMessage", async ({ message, userName, roomName }, callback) => {
      let roomId = await getRoom(roomName);
      let msg = "received a message";
      socket.broadcast
        .to(roomId)
        .emit("showNotification", `${message} sent by: ${userName} room: ${roomName}`);
    });
    callback();
  });

  //invite user to private room
  socket.on("inviteUser", async ({ friendId, inviterId, roomId }, callback) => {
    const inviterName = await getUserName(inviterId);
    console.log(roomId);
    const roomName = await getRoomName(roomId);
    let msg = `${inviterName} has invited you to join ${roomName}`;
    await addNotification(msg, roomId, friendId);
    const notification = await getNotification(friendId);
    console.log("notification outside", notification);
    // io.to(workspace).emit(`${friendId}`, { msg: `${inviterName} invited to join ${roomName} `, roomId });
    io.to(workspace).emit(`${friendId}`, { notification });
    callback();
  });

  //disconnect from room
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
};
