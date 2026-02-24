// defined model
//user schema
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trime: true,
  },
  email: {
    type: String,
    required: true,
    trime: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  age: {
    type: Number,
  },
});

module.exports = mongoose.model("User", UserSchema);
