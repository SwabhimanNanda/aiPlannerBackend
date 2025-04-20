const Joi = require("joi");

// Signup Schema
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Login Schema (Accepts email OR username)
const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().required(),
});

// Forgot Password Schema
const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/) // Allow only common domains
    .required()
    .messages({
      "string.pattern.base":
        "Only Gmail, Yahoo, or Outlook emails are allowed.",
      "any.required": "Email is required.",
    }),
});

// Reset Password Schema
const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/) // Allow only common domains
    .required()
    .messages({
      "string.pattern.base":
        "Only Gmail, Yahoo, or Outlook emails are allowed.",
      "any.required": "Email is required.",
    }),
  otp: Joi.string().min(4).required(),
  password: Joi.string().min(6).required(),
  // confirmPassword: Joi.ref("newPassword"),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
