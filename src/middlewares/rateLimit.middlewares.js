const rateLimit = require("express-rate-limit");

// Global rate limit: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many requests from this IP, please try again after 15 minutes \n",
  standardHeaders: true,
  legacyHeaders: false,
});

// Login rate limit: 5 requests per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many login attempts, please try again after a minute \n",
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP limit: 4 attempts per minute per email
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4,
  keyGenerator: (req) => req.body?.email || req.ip, // Prevents crash if email is missing
  message: "Too many OTP attempts, please try again after a minute \n",
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter: 20 requests per 15 minutes, excluding successful ones
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  skipSuccessfulRequests: true, // Doesn't count successful attempts
  standardHeaders: true,
  legacyHeaders: false,
});

const otpRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // Allow only 1 request per minute per IP
  message: {
    statusCode: "error",
    success: false,
    message: "Please wait a minute before requesting a new OTP.",
  },
  standardHeaders: true, // Return rate limit headers
  legacyHeaders: false, // Disable X-RateLimit headers
});
module.exports = {
  globalLimiter,
  authLimiter,
  loginLimiter,
  otpLimiter,
  otpRateLimiter,
};
