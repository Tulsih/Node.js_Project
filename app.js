const express = require("express");
const app = express();
const PORT = 3000;
const route = require("./src/routes/index");

app.use(express.json());
// routes
//respond with Hello World on Homepage
// app.get("/", (req, res) => {
//   res.send("hello world !");
// });

const userRoute = require("./src/routes/userRoute");
app.use("/", userRoute);

app.listen(PORT, () => {
  console.log(`Listening port of ${PORT}`);
});
