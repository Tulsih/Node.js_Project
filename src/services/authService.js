//validation
//res sent to controller
const MessageConstant = require("../constant/MessageConstant");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const loginSchema = require("../validation/loginValidation");
const validate = require("../validation/index");
const { NotFoundException } = require("../exceptions/ApiError");
const { generateToken } = require("../utils/jwtUtils");

class AuthService {
  async login(data) {
    //validation email & passwored login
    const validation = await validate(loginSchema, data);
    if (!validation.success) {
      throw new Error(validation.message);
    }

    const { email, password } = validation.data;

    //check user is existes in database using email
    const user = await User.findOne({ email });

    if (!user) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }
    //check user status
    if (user.status === "BLOCK" || user.status === "INACTIVE") {
      throw new Error(MessageConstant.USER_ACCOUNT_STATUS);
    }
    //verify the password using bcrypt
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
      throw new NotFoundException(MessageConstant.INVALID_PASSWORD);
    }

    //JWT payload
    const payload = {
      userId: user._id,
      email: user.email,
      roles: user.roles,
      status: user.status,
    };

    //Genrate JWT Tokens with 5 min expiry
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
