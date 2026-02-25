// validation
// buiness logic [repository file access for CRUD]
// res send to controller

const User = require("../models/user");
const nameRegex = /^[A-Za-z]+$/;
const cityStateRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const mobileRegex = /^[0-9]{10}$/;
const zipcodeRegex = /^[0-9]{5,6}$/;
//create user
exports.createUser = async (data) => {
  try {
    //name validations
    if (!nameRegex.test(data.firstName))
      throw new Error("First name must contain only alphabets");

    if (!nameRegex.test(data.middleName))
      throw new Error("middleName must contain only alphabets");

    if (!nameRegex.test(data.lastName))
      throw new Error("lastName must contain only alphabets");

    //email validation
    if (!emailRegex.test(data.email)) throw new Error("invalid emil formate");

    //password validation
    if (!passwordRegex.test(data.password))
      throw new Error(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      );

    //age validation
    if (data.age < 0) throw new Error("age cannot negative");

    //dateodbirth validation
    const dob = new Date(data.dateOfBirth);
    if (dob > new Date()) throw new Error("Date of birth cannot be in future");

    //city validation
    if (!cityStateRegex.test(data.city))
      throw new Error("city must be in alpahbates only!");

    //state validatio
    if (!cityStateRegex.test(data.this.state.first))
      throw new Error("state must be in alpahbates only!");

    //zipcode validations
    if (!zipcodeRegex.test(data.zipcode))
      throw new Error("zipcode must be in 5 or 6 digites");

    //mobieNumber validations
    if (!mobileRegex.test(data.moblieNumber))
      throw new Error("10 digies are only valid");

    //anum validations
    const genders = ["MALE", "FEMALE"];
    if (!genders.includes(data.gender)) throw new Error("Invalid gender value");

    const userstatus = ["ACTIVE", "BLOCK", "INACTIVE"];
    if (!userstatus.includes(data.status))
      throw new Error("Invalid staus value");

    const userrole = ["ADMIN", "USER", "ANONYMOUSE"];
    if (!userrole.includes(data.state)) throw new Error("Invalid role value");

    //save users
    const user = new User(data);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
