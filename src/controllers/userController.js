// controller req, res, exception
// call service

const MessageConstant = require("../constant/MessageConstant");
// const userService = require("../services/userService");
const validate = require("../validation/index");
const UserSchema = require("../validation/userValidation");
const user = require("../models/user");

class UserController {
  //create user
  async createUser(req, res) {
    try {
      //valiadtion
      const validationResult = validate(UserSchema, req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "validation failed",
          error: validationResult.error,
        });
      }
      const userData = validationResult.data;
      //sace to database
      const newUser = await user.createUser(userData);
      return res.status(201).json({
        success: true,
        message: MessageConstant.USER_CREATED,
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        error: error.message,
      });
    }
  }

  //get  all users
  async getAllUsers(req, res) {
    try {
      const users = await user.find();
      return res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        error: error.message,
      });
    }
  }

  //get single user by id

  async getUserbyId(req, res) {
    try {
      const users = await user.findById(req.params.id);
      if (!users) {
        return res.status(400).json({
          success: false,
          message: MessageConstant.USER_NOT_FOUND,
        });
      }
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        error: error.message,
      });
    }
  }

  //update the user

  async updateUsers(req, res) {
    try {
      //valiadtion
      const validationResult = validate(UserSchema, req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "validation failed",
          error: validationResult.error,
        });
      }
      const updateUsers = await user.findByIdAndUpdate(
        req.params.id,
        validationResult.data,
        { new: true },
      );

      if (!updateUsers) {
        return res.status(404).json({
          success: false,
          message: MessageConstant.USER_NOT_FOUND,
        });
      }
      return res.status(200).json({
        success: true,
        message: MessageConstant.USER_UPDATE,
        data: updateUsers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        error: error.message,
      });
    }
  }

  //delete users

  async deleteUsers(req, res) {
    try {
      const deleteuser = await user.findByIdAndDelete(req.params.id);
      if (!deleteuser) {
        return res.status(400).json({
          success: false,
          message: MessageConstant.USER_NOT_FOUND,
          error: error.message,
        });
      }
      return res.status(200).json({
        success: true,
        message: MessageConstant.USER_DELETE,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "server error",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
