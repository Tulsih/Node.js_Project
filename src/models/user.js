// defined model
//user schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      // match: /^[A-Za-z]+$/,
    },
    middleName: {
      type: String,
      required: true,
      trim: true,
      // match: /^[A-Za-z]+$/,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      // match: /^[A-Za-z]+$/,
    },
    fullName: {
      type: String,
    },
    initialLetter: {
      type: String,
      maxlength: 2,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    city: {
      type: String,
      // match: /^[A-Za-z]+$/,
    },
    state: {
      type: String,
      // match: /^[A-Za-z]+$/,
    },
    zipcode: {
      type: Number,
    },
    mobileNumber: {
      type: Number,
      length: 10,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCK", "INACTIVE"],
    },
    roles: {
      type: String,
      enum: ["ADMIN", "USER", "ANONYMOUSE"],
    },
  },
  {
    timestamps: true, //createAt , updatedAt
  },
);

//hook are automatic functions that run before and after databse actions
//pre('save)
UserSchema.pre("save", async function (next) {
  //genrated full name
  this.fullName = `${this.firstName} ${this.middleName} ${this.lastName}`;

  //Convert initialLatter to uppercase
  if (this.initialLatter) {
    this.initialLatter = this.initialLatter.toUpperCase();
  }

  //password if modified
  //Before saving a user, check if the password was changed. If yes, hash it. If not, leave it as it is.

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
module.exports = mongoose.model("Users", UserSchema);
