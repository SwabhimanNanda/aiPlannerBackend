const express = require("express");
const { adminControllers } = require("../controllers");
const checkAdminAuth = require("../middlewares/admin.middlewares");
const { loginLimiter } = require("../middlewares/rateLimit.middlewares");
const {
  createAdminSchema,
  loginAdminSchema,
} = require("../validations/admin.validations");
const validate = require("../validations/validateRequest.validations");
const router = express.Router();

router
  .route("/add-admin")
  .post(
    checkAdminAuth,
    validate(createAdminSchema),
    adminControllers.createAdmin
  );
router
  .route("/")
  .post(loginLimiter, validate(loginAdminSchema), adminControllers.loginAdmin);

module.exports = router;
