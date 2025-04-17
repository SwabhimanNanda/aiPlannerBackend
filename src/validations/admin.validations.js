const Joi = require("joi");

const createAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Adjust the minimum length as needed
  phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits.",
    }),
});

const loginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  createAdminSchema,
  loginAdminSchema,
};
