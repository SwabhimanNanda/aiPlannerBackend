// const passport = require("passport");
// const GitHubStrategy = require("passport-github2").Strategy;
// const axios = require("axios");
// const config = require("../../config");
// const User = require("../../db/models/user.models");
// const { tokenServices } = require("../index");

// async function getGitHubEmail(accessToken) {
//   try {
//     const response = await axios.get("https://api.github.com/user/emails", {
//       headers: { Authorization: `token ${accessToken}` },
//     });

//     if (response.data.length > 0) {
//       const primaryEmail = response.data.find(
//         (email) => email.primary && email.verified
//       );
//       return primaryEmail ? primaryEmail.email : response.data[0].email;
//     }

//     return null;
//   } catch (error) {
//     console.error("Error fetching GitHub email:", error);
//     return null;
//   }
// }

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: config.Github_Auth.githubClientId,
//       clientSecret: config.Github_Auth.githubClientSecret,
//       callbackURL: config.Github_Auth.githubCallbackUrl,
//       passReqToCallback: true,
//       session: false,
//     },

//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         let email = profile.emails?.[0]?.value || null;

//         if (!email) {
//           email = await getGitHubEmail(accessToken);
//         }

//         if (!email) {
//           return done(new Error("GitHub account has no public email"), null);
//         }

//         let user = await User.findOne({ email });

//         if (!user) {
//           user = await User.create({
//             githubId: profile.id,
//             name: profile.displayName || profile.username,
//             email: email,
//             profilePhotoLink: profile.photos?.[0]?.value || "",
//           });
//         } else {
//           if (!user.isProfilePicManual) {
//             user.profilePhotoLink = profile.photos?.[0]?.value || "";
//           }

//           user.githubId = profile.id;
//           user;
//           await user.save();
//         }

//         const payload = { id: user.id, type: config.jwt.tokenTypes.ACCESS };
//         const jwtAccessToken = tokenServices.generateToken(
//           payload,
//           config.jwt.accessExpiration
//         );

//         const refreshPayload = {
//           ...payload,
//           type: config.jwt.tokenTypes.REFRESH,
//         };
//         const jwtRefreshToken = tokenServices.generateToken(
//           refreshPayload,
//           config.jwt.refreshExpiration,
//           config.jwt.refreshSecret
//         );
//         return done(null, { user, jwtAccessToken, jwtRefreshToken });
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );
