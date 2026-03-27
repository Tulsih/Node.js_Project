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
const { UserStatus } = require("../enum/UserStatus");

//5 login attemptes
const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS || 5;

class AuthService {
  //login send otp
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
    if (user.status === UserStatus.BLOCK) {
      throw new AccessDeniedError(MessageConstant.ACCOUNT_BLOCK);
    }

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
        user.status = UserStatus.BLOCK;
        // user.blockUntil = new Date(Date.now() + BLOCK_DURATION);
        await user.save();

        //call email services
        await emailService.sendBlockEmail(user);
      }
      await user.save();

      throw new UnauthorizedException(MessageConstant.INVALID_EMAIL_PASSWORED);
    }

    //correct password
    user.loginAttempts = 0;

    //generate otp 6 number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //hased otp
    const hashedOtp = await bcrypt.hash(otp, 10);

    //expiry time
    const otpExpireMinutes = process.env.OTP_EXPIRE_MINUTES;
    const otpExpiryTime = new Date(Date.now() + otpExpireMinutes * 60 * 1000);

    //save otp
    user.otp = hashedOtp;
    user.otpExpires = otpExpiryTime;

    await user.save();

    //send otp email
    await emailService.sendOtpEmail(user, otp);

    return {
      message: MessageConstant.OTP_SENT,
    };
  }

  //verify opt
  async verifyOtp(data) {
    const { email, otp } = data;

    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }
    if (!user.otp || !user.otpExpires) {
      throw new InvalidRequestException(MessageConstant.OTP_NOT_FOUND);
    }

    //check expiry
    if (Date.now() > user.otpExpires) {
      throw new InvalidRequestException(MessageConstant.OTP_EXPIRED);
    }

    //compre otp
    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      throw new unAuthorizeResponse(MessageConstant.INVALID_OTP);
    }

    //clear otp after success
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    //JWT payload
    const payload = {
      userId: user._id,
      roles: user.roles,
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
