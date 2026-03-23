// defined user routes
// user controller

const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
//define routes

route.post("/", userController.createUser);
route.post("/login", authController.login);
route.get("/list", userController.getAllUsers);
route.get("/:id", userController.getUserbyId);
route.put("/:id", userController.updateUsers);
route.delete("/:id", userController.deleteUsers);

module.exports = route;
