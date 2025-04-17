const express = require("express");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin",
    route: require("./admin.routes"),
  },
  {
    path: "/",
    route: require("./auth.routes"),
  },
  {
    path: "/user",
    route: require("./userAuth.routes"),
  },
  {
    path: "/user",
    route: require("./health.routes"),
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
