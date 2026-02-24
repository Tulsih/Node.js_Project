// main routes
/**
 *
 * e.g. user-> main routes
 *      / list // sub routes
 *      / get
 *      /create
 *      /delete
 *
 */

const express = require("express");
const route = express();

const userRoute = require("./userRoute");

//main routes

// route.get("/", (req, res) => {
//   res.status(200).json({
//     message: "hello world",
//   });
// });

//sub routes
route.use("/users", userRoute);

module.exports = route;
