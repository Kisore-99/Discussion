const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const Logger = require("../config/logger");

const logger = new Logger("app");

//controllers
const { loginRoom, getUsers } = require("../controllers/workspace");

//validator
const { loginValidation } = require("../helpers/validators");

//login route

router.post("/login", async (req, res) => {
  const body = req.body;
  let errors = {};
  //adding body ad log data
  logger.setLogData(body);
  logger.info("Request received at /login", req.body);
  if (body.workspaceName === null || body.workspaceName === "") {
    logger.error("WorkspaceID field is empty");
    errors["workspace"] = "WorkspaceID field is empty";
  }
  if (body.emailId === null || body.emailId === "") {
    logger.error("emailId field is empty");
    errors["emailId"] = "emailId field is empty";
  }
  const user = {
    workspaceName: req.body.workspaceName,
    emailId: req.body.emailId
  };
  // console.log(user);
  const { error } = loginValidation(user);
  console.log(error);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }
  if (Object.keys(errors).length != 0) {
    logger.error("Return error response", {
      sucess: false
    });
  } else {
    logger.info("Return success response", {
      sucess: true
    });
    await loginRoom(user.emailId, user.workspaceName, res);
  }
});

//fetch users
router.get("/users", async (req, res) => {
  let workspaceName = req.query.workspaceName;
  let roomId = req.query.roomId;
  console.log(workspaceName);
  let users = await getUsers(workspaceName, roomId);
  console.log(users);
  res.send(users.flat(Infinity));
});
module.exports = router;
