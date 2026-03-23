const response = require("../helper/generalResponse");
const MessageConstant = require("../constant/MessageConstant");
const authService = require("../services/authService");

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
}
module.exports = new authController();
