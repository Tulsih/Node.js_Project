const express = require("express");
const route = express();

const userRoute = require("./userRoute");

//sub routes
route.use("/users", userRoute);

module.exports = route;
