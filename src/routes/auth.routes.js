const express = require("express");
const passport = require("passport");
const router = express.Router();
const config = require("../config");
const addCookie = require("../utils/addCokkie");
// const statusCodes = require("../utils/httpStatus");

const FRONTEND_URL = "http://localhost:5173"; // Update with your frontend URL

// Google Authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),

  (req, res) => {
    const { accessToken, refreshToken } = req.user;
    handleOAuthSuccess(req, res, "google", accessToken, refreshToken);
  }
);

// Facebook Authentication
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { accessToken, refreshToken } = req.user;
    handleOAuthSuccess(req, res, "facebook", accessToken, refreshToken);
  }
);

// GitHub Authentication
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { jwtAccessToken, jwtRefreshToken } = req.user;
    const accessToken = jwtAccessToken;
    const refreshToken = jwtRefreshToken;

    handleOAuthSuccess(req, res, "github", accessToken, refreshToken);
  }
);

// Function to handle OAuth success and redirect
const handleOAuthSuccess = (req, res, provider, accessToken, refreshToken) => {
  const { user } = req.user;

  if (!user || !accessToken || !refreshToken) {
    return res.redirect(`${FRONTEND_URL}/login?error=OAuthFailed`);
  }
  // Store refresh token in a secure, HTTP-only cookie
  addCookie(refreshToken, res);
  // Redirect to frontend with user info in the URLconsole.log(config.frontendUrl)
  const redirectURL = `${config.frontendUrl}/auth/${provider}/callback?provider=${provider}&id=${user.id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email || "No email provided")}&avatar=${encodeURIComponent(user.profilePhotoLink)}&accessToken=${accessToken}`;
  res.redirect(redirectURL);
};

module.exports = router;
