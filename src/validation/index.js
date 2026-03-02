const validate = (schema, data) => {
  try {
    const validateData = schema.parse(data);
    return {
      success: true,
      data: validateData,
    };
  } catch (error) {
    return {
      success: false,
      error: error.errors,
    };
  }
};

module.exports = validate;
