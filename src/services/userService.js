// validation
// buiness logic [repository file access for CRUD]
// res send to controller

//first , create class , create user then validate data and svae users .1

const MessageConstant = require("../constant/MessageConstant");
const User = require("../models/user");
const {
  createUser,
  deleteUsers,
  updateUsers,
  getAllUsers,
  getUserbyId,
} = require("../repositories/userRepository");

class UserService {
  //create user
  async createUser(data) {
    try {
      // validate data
      this.validateData(data);

      //save users
      const savedUser = await createUser(data);
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
      throw new Error(MessageConstant.USER_NOT_FOUND);
    }
    return user;
  }
  // updated users
  async updateUsers(id, data) {
    await this.validateData(data); //vaidateData
    return await updateUsers(id, data);
  }

  //delete users
  async deleteUsers(id) {
    return await deleteUsers(id);
  }
}

module.exports = new UserService();
