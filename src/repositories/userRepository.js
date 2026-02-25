// CRUD Operation
const Users = require("../models/user");

// create users
const createUsers = async (userData) => {
  return await Users.create(userData);
};

//read all users
const getAllUsers = async () => {
  return await Users.find();
};

//read users by id
const getUserbyId = async (id) => {
  return await Users.findById(id);
};

//updated users
const updateUsers = async (id, updateUsers) => {
  return await Users.findByIdAndUpdate(
    id,
    updateUsers,
    { new: true }, // return updated data
  );
};

//delete users
const deleteUsers = async (id) => {
  return await Users.findByIdAndDelete(id);
};

module.exports = {
  createUsers,
  getAllUsers,
  getUserbyId,
  updateUsers,
  deleteUsers,
};
