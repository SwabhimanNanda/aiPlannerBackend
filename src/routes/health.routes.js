const express = require("express");
const { healthControllers } = require("../controllers");
const checkUserAuth = require("../middlewares/user.middlewares");
const router = express.Router();

// router.get("/health/:slug", healthControllers.getHealthBySlug);
router.post("/health", checkUserAuth, healthControllers.createHealth);
router.get("/all-health", checkUserAuth, healthControllers.getAllHealthData);
router.get(
  "/health-data",
  checkUserAuth,
  healthControllers.getHealthDataByTimePeriodAndField
);

module.exports = router;
