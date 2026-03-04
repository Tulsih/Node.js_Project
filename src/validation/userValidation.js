const z = require("zod");
const MessageConstant = require("../constant/MessageConstant");
const { listUserStatus } = require("../enum/UserStatus");
const { listUserGender } = require("../enum/UserGender");
const { listUserRoles } = require("../enum/UserRoles");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const nameRegex = /^[A-Za-z]+$/;
const cityStateRegex = /^[A-Za-z\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const mobileRegex = /^[0-9]{10}$/;
const zipcodeRegex = /^[0-9]{5,6}$/;

// capitalize first later
const capitalize = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};
//age calulation function
const calculateAge = (dob) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const user = z
  .object({
    //name validations
    firstName: z
      .string()
      .min(1)
      .trim()
      .regex(nameRegex, MessageConstant.FIRST_NAME_ONLY_ALPHABETS),

    middleName: z
      .string()
      .min(1)
      .trim()
      .regex(nameRegex, MessageConstant.MIddle_NAME_ONLY_ALPHABETS),

    lastName: z
      .string()
      .min(1)
      .trim()
      .regex(nameRegex, MessageConstant.LAST_NAME_ONLY_ALPHABETS),

    //email validations
    email: z
      .string()
      .trim()
      .regex(emailRegex, MessageConstant.INVALID_EMAIL_FORMATE)
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
    password: z
      .string()
      .min(8)
      .regex(passwordRegex, MessageConstant.PASSWORD)
      .transform(async (password) => {
        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(password, saltRounds);
        return hashedpassword;
      }),

    //date of brith validatio // 18 years old at least (YYYY-MM-DD)
    dateOfBirth: z.coerce
      .date()
      .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), {
        //(3-3-2026 (max dob -3-3-2008)2008 above yres are not 18 years old)2008(2026-18))
        message: MessageConstant.BOD_MUST_AT_LEAT_YEAR_OLD,
      })
      .superRefine((dob, ctx) => {
        const age = calculateAge(dob);

        if (age < 18) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: MessageConstant.DATE_OF_BRITH,
            path: ["dateOfBirth"],
          });
        }
      }),
    //age validations
    // curent datd - dob = aeg  , not show in input value direct stored in backend

    //city validation
    city: z
      .string()
      .trim()
      .min(1)
      .max(30)
      .regex(cityStateRegex, MessageConstant.CITY_NAME_ONLY_ALPHABETS),

    //state validation
    state: z
      .string()
      .trim()
      .min(1)
      .max(30)
      .regex(cityStateRegex, MessageConstant.STATE_ONLY_ALPHABETS),

    //zpicode valiadtion
    zipcode: z
      .string()
      .trim()
      .regex(zipcodeRegex, MessageConstant.ZIPCODE_ONLY_DIGITES),

    //mobilnember
    mobileNumber: z
      .string()
      .regex(mobileRegex, MessageConstant.MOBILE_NUMBER_ONLY_10_DIGITES),

    //anum validation
    gender: z.enum(listUserGender, { message: MessageConstant.INVALID_GENDER }),

    status: z.enum(listUserStatus, {
      message: MessageConstant.INVALID_USERS_STATUS,
    }),

    roles: z.enum(listUserRoles, {
      message: MessageConstant.INVALID_USERS_ROLE,
    }),
  })
  .transform((data) => {
    const firstName = capitalize(data.firstName);
    const middleName = capitalize(data.middleName);
    const lastName = capitalize(data.lastName);

    return {
      ...data,
      fullName: `${firstName} ${middleName} ${lastName}`,
      age: calculateAge(data.dateOfBirth),
    };
  });

module.exports = user;
