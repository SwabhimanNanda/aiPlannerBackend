const express = require("express");
const router = express.Router();

const { userControllers } = require("../controllers");

const {
  // otpLimiter,
  loginLimiter,
  // otpRateLimiter,
} = require("../middlewares/rateLimit.middlewares");
const checkUserAuth = require("../middlewares/user.middlewares");

const {
  signupSchema,
  loginSchema,
  // forgotPasswordSchema,
  // resetPasswordSchema,
} = require("../validations/user.validations");
const validate = require("../validations/validateRequest.validations");

// Routes
router.post("/register", validate(signupSchema), userControllers.registerUser);
// router.post("/verifyOtp", userTempControllers.verifyOtp);
// router.post("/resend-otp", otpLimiter, userTempControllers.resendOtp);
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  userControllers.loginUser
);

// router.post(
//   "/forgot-password",
//   otpLimiter,
//   validate(forgotPasswordSchema),
//   userControllers.forgotPassword
// );

// router.post(
//   "/reset-password",
//   validate(resetPasswordSchema),
//   userControllers.resetPassword
// );

// old Arch to verify the Email
// router
//     .route("/verify-email")
//     .get(checkUserAuth, userControllers.emailVerified)
//     .post(checkUserAuth, userControllers.emailOtpVerified);

router.route("/username-available").post(userControllers.usernameExist);

router.route("/profile").get(checkUserAuth, userControllers.getAllInfoUser);

router.route("/refresh_token").post(userControllers.getNewAccessToken);

module.exports = router;
