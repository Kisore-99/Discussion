const express = require("express");
const app = (module.exports.app = express());
const socketio = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

//logger
const logger = require("./config/logger");

//getting routes
const workspace = require("./routes/workspace");
const room = require("./routes/room");
const notification = require("./routes/notification");

//multer-storing files
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

var upload = multer({ storage: storage }).single("file");

app.post("/api/chat/uploadfiles", (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, url: res.req.file.path });
  });
});

const port = process.env.PORT || 5000;

//instance of socketio
const io = (module.exports.io = socketio(server));
const SocketManager = require("./SocketManager");

//cors middleware
app.use(cors());

//bodyParser middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

io.on("connect", SocketManager);

//db config
const { mongoURI } = require("./config");
//connect to mongodb
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MONGODB connected"))
  .catch(err => console.log(err));

//routes
app.use("/workspace", workspace);
app.use("/rooms", room);
app.use("/notifications", notification);
app.use("/uploads", express.static("uploads"));

server.listen(port, () => console.log("server is running"));
