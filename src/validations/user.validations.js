const Joi = require("joi");

// Signup Schema
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits.",
    }),
  age: Joi.number().integer().min(10).max(100).required(),
});

// Login Schema (Accepts email OR username)
const loginSchema = Joi.object({
  email: Joi.string().email(),
  username: Joi.string().alphanum().min(3).max(30),

  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
})
  .or("email", "username") // ✅ At least one of them (email or username) must be present
  .messages({
    "object.missing": "Either email or username is required.", // Error when both are missing
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
