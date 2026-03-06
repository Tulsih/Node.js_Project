//throw error
class AppError extends Error {
  constructor(code, description) {
    super(description);
    this.code = code;
    this.description = description;
    this.status = "ERROR";
  }
}
module.exports = AppError;
