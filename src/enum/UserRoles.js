const { object } = require("zod");

const UserRoles = {
  ADMIN: "ADMIN",
  USER: "USER",
  ANONYMOUS: "ANONYMOUS",
};
const listUserRoles = Object.keys(UserRoles);

module.exports = { UserRoles, listUserRoles };
