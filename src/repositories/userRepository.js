// CRUD Operation
const MessageConstant = require("../constant/MessageConstant");
const Users = require("../models/user");

//create users

const createUser = async (userData) => {
  const user = new Users(userData);
  return await user.save();
  //save user object into databse
  //also writen like this
  //return await Users.create(userData);
};

//get all users
const getAllUsers = async () => {
  return await Users.find();
};

//get users by id
const getUserbyId = async (id) => {
  return await Users.findById(id);
};

//updated users
const updateUsers = async (id, upadteData) => {
  const updateUser = await Users.findByIdAndUpdate(id, upadteData, {
    returnDocument: "after",
    runValidators: true, //run schema validation before update
  });
  if (!updateUser) {
    throw new Error(MessageConstant.USER_NOT_FOUND);
  }
  return updateUser;
};

//deleted users
const deleteUsers = async (id) => {
  const deleteUsers = await Users.findByIdAndDelete(id);

  if (!deleteUsers) {
    throw new Error(MessageConstant.USER_NOT_FOUND);
  }
  return { message: MessageConstant.USER_DELETE };
};

module.exports = {
  createUser,
  getAllUsers,
  getUserbyId,
  updateUsers,
  deleteUsers,
};
