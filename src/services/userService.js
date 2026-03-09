// validation
// buiness logic [repository file access for CRUD]
// res send to controller

//first , create class , create user then validate data and svae users .1

const MessageConstant = require("../constant/MessageConstant");
const {
  InvalidRequestException,
  NotFoundException,
} = require("../exceptions/ApiError");
const User = require("../models/user");
const {
  createUser,
  deleteUsers,
  updateUsers,
  getAllUsers,
  getUserbyId,
} = require("../repositories/userRepository");
const validate = require("../validation/index");
const userSchema = require("../validation/userValidation");

class UserService {
  //create user
  async createUser(data) {
    try {
      // zod validation
      const valiadtion = await validate(userSchema, data);
      if (!valiadtion.success) {
        throw new InvalidRequestException(valiadtion.message);
      }
      const savedUser = await createUser(valiadtion.data);
      return savedUser;
    } catch (error) {
      console.error("Error :", error);
      throw error;
    }
  }
  //get all users
  async getAllUsers() {
    return await getAllUsers();
  }

  // get users by id
  async getUserbyId(id) {
    const user = await getUserbyId(id);
    if (!user) {
      throw new NotFoundException(MessageConstant.USER_NOT_FOUND);
    }
    return user;
  }
  // updated users
  async updateUsers(id, data) {
    // zod vaidateData
    const valiadtion = await validate(userSchema, data);
    if (!valiadtion.success) {
      throw new InvalidRequestException(valiadtion.message);
    }
    return await updateUsers(id, valiadtion.data);
  }

  //delete users
  async deleteUsers(id) {
    return await deleteUsers(id);
  }
}

module.exports = new UserService();
