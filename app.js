const express = require("express");
const app = express();
const PORT = 3000;
const route = require("./src/routes/index");
const connectDatabase = require("./src/config/dbConfig");

app.use(express.json());

//database connections
connectDatabase();
// routes
app.use("/", route);

app.listen(PORT, () => {
  console.log(`Listening port of ${PORT}`);
});
