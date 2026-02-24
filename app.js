const express = require("express");
const app = express();
const PORT = 3000;
const route = require("./src/routes/index");
// const connectDB = require("./src/config/dbConfig");

// const { connectDatabase } = require("./src/config/dbConfig");
const connectDatabase = require("./src/config/dbConfig");

app.use(express.json());
// routes
//respond with Hello World on Homepage
// app.get("/", (req, res) => {
//   res.send("hello world !");
// });

// const userRoute = require("./src/routes/userRoute");
app.use("/", route);

//database connections
// connectDB.connectDatabase();
connectDatabase();

app.listen(PORT, () => {
  console.log(`Listening port of ${PORT}`);
});
