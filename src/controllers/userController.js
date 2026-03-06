// controller req, res, exception
// call service

const validate = require("../validation/index");
const UserSchema = require("../validation/userValidation");
const user = require("../models/user");
const response = require("../helper/generalResponse");
const AppError = require("../exceptions/ApiError");
const MessageConstant = require("../constant/MessageConstant");

class UserController {
  //create user
  async createUser(req, res, next) {
    try {
      //valiadtion
      const validationResult = await validate(UserSchema, req.body);
      console.log("validateREsult :", validationResult);
      if (!validationResult.success) {
        console.log(validationResult.error);
        // return response.badRequestResponse(res);
        return next(new AppError(400, MessageConstant.VAIDATION_FAILD));
      }
      const userData = validationResult.data;
      //save to database
      const newUser = await user.create(userData);

      return response.createdResponse(res, newUser);
    } catch (error) {
      console.log("error: ", error);
      next(error);

      //email existed
      // if (error.code === 11000) {
      //   // return response.conflictResponse(res);

      // }
      // // return response.InternalServerError(res, error?.message);
    }
  }

  //get  all users
  async getAllUsers(req, res, next) {
    try {
      const users = await user.find();
      return response.getOkResponse(res, users);
    } catch (error) {
      console.log("error: ", error);
      next(error);
      // return response.InternalServerError(res, error?.message);
    }
  }

  //get single user by id
  async getUserbyId(req, res, next) {
    try {
      const users = await user.findById(req.params.id);
      if (!users) {
        // return response.badRequestResponse(res);
        return next(new AppError(404, MessageConstant.USER_NOT_FOUND));
      }
      return response.getOkResponse(res, users);
    } catch (error) {
      console.log("error: ", error);
      next(error);

      // return response.InternalServerError(res, error?.message);
    }
  }

  //update the user
  async updateUsers(req, res, next) {
    try {
      //valiadtion
      const validationResult = await validate(UserSchema, req.body);
      console.log("validateREsult :", validationResult);
      if (!validationResult.success) {
        console.log(validationResult.error);
        return next(new AppError(400, MessageConstant.VAIDATION_FAILD));
        // return response.badRequestResponse(res);
      }
      const updateUsers = await user.findByIdAndUpdate(
        req.params.id,
        validationResult.data,
        { new: true, runValidators: true },
      );

      if (!updateUsers) {
        return next(new AppError(404, MessageConstant.USER_NOT_FOUND));
        // return response.notFoundResponse(res);
      }
      return response.updatedResponse(res, updateUsers);
    } catch (error) {
      console.log("error: ", error);
      next(error);
      // return response.InternalServerError(res, error?.message);
    }
  }

  //delete users
  async deleteUsers(req, res, next) {
    try {
      const deleteuser = await user.findByIdAndDelete(req.params.id);
      if (!deleteuser) {
        return next(new AppError(404, MessageConstant.USER_NOT_FOUND));
        // return response.notFoundResponse(res);
      }
      return response.deletedResponse(res, deleteuser);
    } catch (error) {
      console.log("error: ", error);
      next(error);
      // return response.InternalServerError(res, error?.message);
    }
  }
}

module.exports = new UserController();
