// defined model
//user schema
const mongoose = require("mongoose");
const { string } = require("zod");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
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
      unique: true,
      // lowercase: true,
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
    },
    state: {
      type: String,
    },
    zipcode: {
      type: Number,
    },
    mobileNumber: {
      type: string,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCK", "INACTIVE"],
    },
    roles: {
      type: String,
      enum: ["ADMIN", "USER", "ANONYMOUSE"],
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //createAt , updatedAt
  },
);

module.exports = mongoose.model("Users", UserSchema);
