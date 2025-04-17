const express = require("express");
const { healthControllers } = require("../controllers");

const router = express.Router();

router.get("/health/:slug", healthControllers.getHealthBySlug);

module.exports = router;
