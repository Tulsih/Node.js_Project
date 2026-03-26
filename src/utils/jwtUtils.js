//genrated tokens and verify tokens

const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, {
    expiresIn: "30m",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken };
