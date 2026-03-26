const response = require("../helper/generalResponse");
const MessageConstant = require("../constant/MessageConstant");
const authService = require("../services/authService");
const User = require("../models/user");

class authController {
  //login user
  async login(req, res, next) {
    try {
      //call auth services
      const result = await authService.login(req.body);
      console.log(authService);
      return response.getOkResponse(res, result, MessageConstant.LOGIN_SUCCESS);
    } catch (error) {
      console.log("error:", error);
      next(error);
    }
  }
  //admin unblocks a user

  async unblockUser(req, res, next) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (!user) {
        return response.notFoundResponse(res, MessageConstant.USER_NOT_FOUND);
      }

      user.status = "ACTIVE";
      user.loginAttempts = 0;

      await user.save();

      return response.updatedResponse(
        res,
        user,
        MessageConstant.USER_UNBLOCKED,
      );
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new authController();
