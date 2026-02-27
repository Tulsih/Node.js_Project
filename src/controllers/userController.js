// controller req, res, exception
// call service

const MessageConstant = require("../constant/MessageConstant");
const userService = require("../services/userService");

class UserController {
  //create user
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const newUser = await userService.createUser(userData);

      return res.status(201).json({
        message: MessageConstant.USER_CREATED,
        data: newUser,
      });
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  }

  //get  all users
  async getAllUsers(req, res, next) {
    try {
      //   const users = await userService.getAllUsers();

      return res.status(200).json({
        message: MessageConstant.USER_GET,
      });
    } catch (error) {
      console.error("Error :", error);
      next(error);
    }
  }

  //get single user by id

  async getUserbyId(req, res, next) {
    try {
      const { id } = req.params;
      //   const user = await userService.getUserbyId(id);

      return res.status(200).json({
        message: MessageConstant.USER_GET_BY_ID,
      });
    } catch (error) {
      console.error("Error : ", error);
      next(error);
    }
  }

  //update the user

  async updateUsers(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updateUsers = await userService.updateUsers(id, updateData);

      return res.status(201).json({
        message: MessageConstant.USER_UPDATE,
        data: updateUsers,
      });
    } catch (error) {
      console.error("Error : ", error);
      next(error);
    }
  }

  //delete users

  async deleteUsers(req, res, next) {
    try {
      const { id } = req.params;
      await userService.deleteUsers(id);

      return res.status(200).json({
        message: MessageConstant.USER_DELETE,
      });
    } catch (error) {
      console.error("Error :", error);
      next(error);
    }
  }
}

module.exports = new UserController();
