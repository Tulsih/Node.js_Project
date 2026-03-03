const { object } = require("zod");

const UserGender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
const listUserGender = Object.keys(UserGender);

module.exports = { UserGender, listUserGender };
