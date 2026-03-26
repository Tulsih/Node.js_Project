const jwt = require("jsonwebtoken");
const MessageConstant = require("../constant/MessageConstant");
const response = require("../helper/generalResponse");
require("dotenv").config();
const { verifyToken } = require("../utils/jwtUtils");
const { UserRoles } = require("../enum/UserRoles");

//verify Token Middleware
const authenticate = (req, res, next) => {
  try {
    //get authorization token form postmam
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("error", error);
      return response.unAuthorizeResponse(
        res,
        MessageConstant.TOKEN_NOT_PROVIDED,
      );
    }
    console.log("auth header :", authHeader);
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.log("invalid token format ", authHeader);
      // Invalid format
      return response.unAuthorizeResponse(res, MessageConstant.INVALID_TOKEN);
    }
    const token = parts[1];
    console.log("extracted token ", token);

    //verify token
    const decoded = verifyToken(token);
    console.log("decoded token ", decoded);
    //decoded ={userid , roles}
    req.user = decoded;

    next();
  } catch (error) {
    console.log("jwt verificatio error", error.message);
    return response.unAuthorizeResponse(res, MessageConstant.UNAUTHORIZED);
  }
};

//check admin role
const isAdmin = (req, res, next) => {
  if (req.user.roles !== UserRoles.ADMIN) {
    return response.unAuthorizeResponse(res, MessageConstant.ACCESS_DENIED);
  }

  next();
};
module.exports = { authenticate, isAdmin };
