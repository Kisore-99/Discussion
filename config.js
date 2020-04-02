const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mongoURI: process.env.mongoURI,
  secret: process.env.secret
};
