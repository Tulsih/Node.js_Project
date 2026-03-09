const MessageConstant = require("../constant/MessageConstant");

//throw error
class AppError extends Error {
  constructor(code, description) {
    super(description);
    this.code = code;
    this.description = description;
    this.status = "ERROR";
  }
}

class InvalidRequestException extends AppError {
  constructor(message = MessageConstant.INVALID_REQUEST) {
    super(400, message);
  }
}

class NotFoundException extends AppError {
  constructor(message = MessageConstant.NOT_FOUND) {
    super(404, message);
  }
}
module.exports = {
  InvalidRequestException,
  NotFoundException,
};
