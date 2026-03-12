//globle errorHandler middelware
const GeneralResponse = require("../helper/generalResponse");
const MessageConstant = require("../constant/MessageConstant");

const errorHandler = (err, req, res, next) => {
  let code = err.code || 500;
  let description = err.description || MessageConstant.SERVER_ERROR;

  //when email existing
  if (err.code === 11000) {
    code = 409;
    description = MessageConstant.EMAIL_EXISTING;
  }

  return new GeneralResponse(
    res,
    null,
    code,
    MessageConstant.ERROR,
    description,
  );
};
module.exports = errorHandler;
