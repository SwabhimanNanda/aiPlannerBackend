const config = require("../../config");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../db/models/user.models");
const { tokenServices } = require("../index");

passport.use(
  new FacebookStrategy(
    {
      clientID: config.Facebook_Auth.facebookClientId,
      clientSecret: config.Facebook_Auth.facebookClientSecret,
      callbackURL: config.Facebook_Auth.facebookCallbackUrl,
      profileFields: ["id", "displayName", "emails", "photos"],
      passReqToCallback: true,
      session: false,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (!user) {
          user = await User.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePhotoLink: profile.photos[0].value,
          });
        } else {
          if (!user.isProfilePicManual) {
            user.profilePhotoLink = profile.photos[0].value;
          }

          user.facebookId = profile.id;
          await user.save();
        }

        const payload = {
          id: user.id,
          type: config.jwt.tokenTypes.ACCESS,
        };

        const newAccessToken = tokenServices.generateToken(
          payload,
          config.jwt.accessExpiration
        );

        const refreshPayload = {
          ...payload,
          type: config.jwt.tokenTypes.REFRESH,
        };

        const newRefreshToken = tokenServices.generateToken(
          refreshPayload,
          config.jwt.refreshExpiration,
          config.jwt.refreshSecret
        );
        return done(null, {
          user,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
