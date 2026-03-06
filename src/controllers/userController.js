// controller req, res, exception
// call service

const validate = require("../validation/index");
const UserSchema = require("../validation/userValidation");
const user = require("../models/user");
const response = require("../helper/generalResponse");

class UserController {
  //create user
  async createUser(req, res) {
    try {
      //valiadtion
      const validationResult = await validate(UserSchema, req.body);
      console.log("validateREsult :", validationResult);
      if (!validationResult.success) {
        console.log(validationResult.error);
        return response.badRequestResponse(res);
      }

      const userData = validationResult.data;

      //sace to database
      const newUser = await user.create(userData);

      return response.createdResponse(res, newUser);
    } catch (error) {
      console.log("error: ", error);
      return response.InternalServerError(res, error?.message);
    }
  }

  //get  all users
  async getAllUsers(req, res) {
    try {
      const users = await user.find();
      return response.getOkResponse(res, users);
    } catch (error) {
      console.log("error: ", error);
      return response.InternalServerError(res, error?.message);
    }
  }

  //get single user by id
  async getUserbyId(req, res) {
    try {
      const users = await user.findById(req.params.id);
      if (!users) {
        return response.badRequestResponse(res);
      }
      return response.getOkResponse(res, users);
    } catch (error) {
      console.log("error: ", error);
      return response.InternalServerError(res, error?.message);
    }
  }

  //update the user
  async updateUsers(req, res) {
    try {
      //valiadtion
      const validationResult = await validate(UserSchema, req.body);
      console.log("validateREsult :", validationResult);
      if (!validationResult.success) {
        console.log(validationResult.error);
        return response.badRequestResponse(res);
      }
      const updateUsers = await user.findByIdAndUpdate(
        req.params.id,
        validationResult.data,
        { new: true, runValidators: true },
      );

      if (!updateUsers) {
        return response.notFoundResponse(res);
      }
      return response.updatedResponse(res, updateUsers);
    } catch (error) {
      console.log("error: ", error);
      return response.InternalServerError(res, error?.message);
    }
  }

  //delete users
  async deleteUsers(req, res) {
    try {
      const deleteuser = await user.findByIdAndDelete(req.params.id);
      if (!deleteuser) {
        return response.notFoundResponse(res);
      }
      return response.deletedResponse(res, deleteuser);
    } catch (error) {
      console.log("error: ", error);
      return response.InternalServerError(res, error?.message);
    }
  }
}

module.exports = new UserController();
