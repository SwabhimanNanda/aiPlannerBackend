const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },

    name: { type: String, required: true },
    username: { type: String, unique: true },
    age: { type: String },
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, select: false }, // Only for manual login users

    profilePhotoLink: { type: String, default: null },
    isProfilePicManual: { type: Boolean, default: false },

    resetOTP: { type: String, default: null }, // Hashed OTP for password reset
    otpExpires: { type: Date, default: null, index: { expires: "10m" } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
