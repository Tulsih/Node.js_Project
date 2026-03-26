//validation
//res sent to controller
const MessageConstant = require("../constant/MessageConstant");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const loginSchema = require("../validation/loginValidation");
const validate = require("../validation/index");
const {
  NotFoundException,
  InvalidRequestException,
  UnauthorizedException,
  AccessDeniedError,
} = require("../exceptions/ApiError");
const { generateToken } = require("../utils/jwtUtils");
require("dotenv").config();
const emailService = require("./emailService");

//5 login attemptes
const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS || 5;

//5 min block duration
// const BLOCK_DURATION = 5 * 60 * 1000;

class AuthService {
  async login(data) {
    //validation email & passwored login
    const validation = await validate(loginSchema, data);
    if (!validation.success) {
      throw new InvalidRequestException(validation.message);
    }

    const { email, password } = validation.data;

    //check user is existes in database using email
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }

    //chcek if user blaocked
    if (user.status === "BLOCKED") {
      throw new AccessDeniedError(MessageConstant.ACCOUNT_BLOCK);
    }
    //auto unblock after 5 mim of block
    // if (user.status === "BLOCK") {
    //   if (user.blockUntil && new Date() > user.blockUntil) {
    //     //auto unblock
    //     user.status = "ACTIVE";
    //     user.loginAttempts = 0;
    //     user.blockUntil = null;
    //     await user.save();
    //   } else {
    //     throw new AccessDeniedError(MessageConstant.ACCOUNT_BLOCK);
    //   }
    // }

    //verify the password using bcrypt
    const ispasswordValid = await bcrypt.compare(password, user.password);
    console.log(" Password valid:", ispasswordValid);

    //wrong password
    //every wrong passwoerd increase attempt count
    if (!ispasswordValid) {
      user.loginAttempts += 1;
      console.log("attempts:", user.loginAttempts);

      //check max count
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.status = "BLOCKED";
        // user.blockUntil = new Date(Date.now() + BLOCK_DURATION);
        await user.save();

        //call email services
        await emailService.sendBlockEmail(user);
      }
      await user.save();

      throw new UnauthorizedException(MessageConstant.INVALID_EMAIL_PASSWORED);
    }

    //reset attemptes after successfully login
    user.loginAttempts = 0;
    //user.blockUntil = null;
    await user.save();
    console.log("login success , attemptes reset");

    //JWT payload
    const payload = {
      userId: user._id,
      roles: user.roles,
      // email: user.email,
      // status: user.status,
    };

    //Genrate JWT Tokens
    const token = generateToken(payload);

    return {
      userId: user._id,
      email: user.email,
      roles: user.roles,
      token,
    };
  }
}

module.exports = new AuthService();
