// defined user routes
// user controller

const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");

//define routes

route.get("/list", userController.getAllUsers);
route.get("/id", userController.getUserbyId);
route.post("/", userController.createUser);
route.put("/id", userController.updateUsers);
route.delete("/id", userController.deleteUsers);

module.exports = route;
