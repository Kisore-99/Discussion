const jwt = require("jsonwebtoken");
const { secret } = require("../config");

const auth = () => {
  const token = req.header("x-auth-token");

  //check for status
  if (!token) return res.status(401).json({ msg: "unauthorized user" });

  try {
    const decoded = jwt.verify(token, secret);
    //add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "token is not valid" });
  }
};
module.exports = auth;
