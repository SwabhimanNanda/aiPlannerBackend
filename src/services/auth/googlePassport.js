// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const config = require("../../config");
// const User = require("../../db/models/user.models"); // MongoDB User Model
// const { tokenServices } = require("../index");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: config.Google_Auth.googleClientId,
//       clientSecret: config.Google_Auth.googleClientSecret,
//       callbackURL: config.Google_Auth.googleCallbackUrl,
//       passReqToCallback: true,
//       session: false,
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ email: profile.emails?.[0]?.value });

//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             profilePhotoLink: profile.photos[0].value,
//             isEmailVerified: true,
//           });
//         } else {
//           if (!user.isProfilePicManual) {
//             user.profilePhotoLink = profile.photos[0].value;
//           }

//           user.googleId = profile.id;
//           await user.save();
//         }
//         const payload = {
//           id: user.id,
//           type: config.jwt.tokenTypes.ACCESS,
//         };

//         const accessToken = tokenServices.generateToken(
//           payload,
//           config.jwt.accessExpiration
//         );

//         const refreshPayload = {
//           ...payload,
//           type: config.jwt.tokenTypes.REFRESH,
//         };

//         const refreshToken = tokenServices.generateToken(
//           refreshPayload,
//           config.jwt.refreshExpiration,
//           config.jwt.refreshSecret
//         );

//         return done(null, { user, accessToken, refreshToken });
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );
