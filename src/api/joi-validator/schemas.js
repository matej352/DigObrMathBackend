const Joi = require("joi");

const usernameSchema = Joi.string().alphanum().min(3).max(30).required();
const passwordSchema = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
  .required();

module.exports = {
  usernameSchema,
  passwordSchema,
};
