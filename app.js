const express = require("express");

const app = express();

const PORT = 3000;

// routes

app.listen(PORT, () => {
  console.log(`Listening port of ${PORT}`);
});
