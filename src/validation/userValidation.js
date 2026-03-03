const z = require("zod");
const MessageConstant = require("../constant/MessageConstant");
const { listUserStatus } = require("../controllers/enum/UserStatus");
const { listUserGender } = require("../controllers/enum/UserGender");
const { listUserRoles } = require("../controllers/enum/UserRoles");
const User = require("../models/user");

const nameRegex = /^[A-Za-z]+$/;
const cityStateRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const mobileRegex = /^[0-9]{10}$/;
const zipcodeRegex = /^[0-9]{5,6}$/;

const user = z.object({
  //name validations
  firstName: z
    .string()
    .min(1)
    .trim()
    .regex(nameRegex, MessageConstant.FIRST_NAME),

  middleName: z
    .string()
    .min(1)
    .trim()
    .regex(nameRegex, MessageConstant.MIddle_NAME),

  lastName: z
    .string()
    .min(1)
    .trim()
    .regex(nameRegex, MessageConstant.LAST_NAME),

  // initialLatter: z
  //   .string()
  //   .max(2)
  //   .optional()
  //   .transform((val) => val.toUpperCase()),

  //email validations
  email: z
    .string()
    .trim()
    .regex(emailRegex, MessageConstant.EMAIL)
    .refine(
      async (email) => {
        const existinEmail = await User.findOne({
          where: { email },
        });
        return !existinEmail; //must return true if valid
      },
      {
        message: MessageConstant.EMAIL_EXISTING,
      },
    ),

  //password validations
  password: z.string().min(8).regex(passwordRegex, MessageConstant.PASSWORD),

  //age validations
  age: z.coerce.number().min(0, MessageConstant.AGE),

  //date of brith validation
  dateOfBirth: z.coerce
    .date()
    .max(new Date(), { message: MessageConstant.DATE_OF_BRITH }),

  //city validation
  city: z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(cityStateRegex, MessageConstant.CITY),

  //state validation
  state: z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(cityStateRegex, MessageConstant.STATE),

  //zpicode valiadtion
  zipcode: z.string().trim().regex(zipcodeRegex, MessageConstant.ZIPCODE),

  //mobilnember
  mobileNumber: z.string().regex(mobileRegex, MessageConstant.MOBILE_NUMBER),

  //anum validation
  gender: z.enum(listUserGender, { message: MessageConstant.GENDER }),

  status: z.enum(listUserStatus, {
    message: MessageConstant.USERS_STATUS,
  }),

  roles: z.enum(listUserRoles, {
    message: MessageConstant.USERS_ROLE,
  }),
});

module.exports = user;
