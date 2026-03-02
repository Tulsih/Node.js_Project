// validation
// buiness logic [repository file access for CRUD]
// res send to controller

//first , create class , create user then validate data and svae users .1

const MessageConstant = require("../constant/MessageConstant");
const User = require("../models/user");
const {
  createUser,
  deleteUsers,
  updateUsers,
  getAllUsers,
  getUserbyId,
} = require("../repositories/userRepository");

const nameRegex = /^[A-Za-z]+$/;
const cityStateRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const mobileRegex = /^[0-9]{10}$/;
const zipcodeRegex = /^[0-9]{5,6}$/;

class UserService {
  //create user
  async createUser(data) {
    try {
      // validate data
      this.validateData(data);

      //save users
      const savedUser = await createUser(data);
      return savedUser;
    } catch (error) {
      console.error("Error :", error);
      throw error;
    }
  }
  //get all users
  async getAllUsers() {
    return await getAllUsers();
  }

  // get users by id
  async getUserbyId(id) {
    const user = await getUserbyId(id);
    if (!user) {
      throw new Error(MessageConstant.USER_NOT_FOUND);
    }
    return user;
  }
  // updated users
  async updateUsers(id, data) {
    await this.validateData(data); //vaidateData
    return await updateUsers(id, data);
  }

  //delete users
  async deleteUsers(id) {
    return await deleteUsers(id);
  }

  //valiadtions
  async validateData(data) {
    //first check data is not null
    if (!data || typeof data !== "object") {
      throw new Error("filed the valid  data !");
    }
    //name validations
    if (!nameRegex.test(data?.firstName))
      throw new Error("First name must contain only alphabets");

    if (!nameRegex.test(data?.middleName))
      throw new Error("middleName must contain only alphabets");

    if (!nameRegex.test(data?.lastName))
      throw new Error("lastName must contain only alphabets");

    //email validation
    if (!emailRegex.test(data?.email)) throw new Error("invalid email formate");

    //if email existed already
    const existingEmail = await User.findOne({
      where: { email: data?.email },
    });

    if (existingEmail) {
      throw new Error(MessageConstant.EMAIL_EXISTING);
    }

    //password validation
    if (!passwordRegex.test(data?.password))
      throw new Error(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      );

    //age validation
    if (data?.age < 0) throw new Error("age cannot negative");

    //dateofbirth validation
    const dob = new Date(data?.dateOfBirth);
    if (dob > new Date()) throw new Error("Date of birth cannot be in future");

    //city validation
    if (!cityStateRegex.test(data?.city))
      throw new Error("city must be in alpahbates only!");

    //state validatio
    if (!cityStateRegex.test(data?.state))
      throw new Error("state must be in alpahbates only!");

    //zipcode validations
    if (!zipcodeRegex.test(data?.zipcode))
      throw new Error("zipcode must be in 5 or 6 digites");

    //mobileNumber validations
    if (!mobileRegex.test(data?.mobileNumber))
      throw new Error("Enter Valid moblieNumber of 10 Digites");

    //anum validations
    const genders = ["MALE", "FEMALE"];
    if (!genders.includes(data?.gender))
      throw new Error("Invalid gender value");

    const userstatus = ["ACTIVE", "BLOCK", "INACTIVE"];
    if (!userstatus.includes(data?.status))
      throw new Error("Invalid staus value");

    const userrole = ["ADMIN", "USER", "ANONYMOUSE"];
    if (!userrole.includes(data?.role)) throw new Error("Invalid role value");
  }
}

module.exports = new UserService();
