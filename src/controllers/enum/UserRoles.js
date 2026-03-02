const { object } = require("zod");

const UserRoles = {
  ADMIN: "ADMIN",
  USER: "USER",
  NONYMOUSE: "NONYMOUSE",
};
const listUserRoles = Object.keys(UserRoles);

module.exports = { UserRoles, listUserRoles };
