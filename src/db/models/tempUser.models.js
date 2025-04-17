const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true },
  age: { type: String },
  email: { type: String, required: true, unique: true },
  password: String, // Hashed password
  resetOTP: String, // 6-digit OTP
  phone_number: String,
  otpExpires: { type: Date },
  failed_attempts: { type: Number, default: 0 },
  row_expires_at: { type: Date, default: () => Date.now() },
});

// ✅ Define TTL index only once (Prevents duplicate warnings)
tempUserSchema.index({ row_expires_at: 1 }, { expireAfterSeconds: 1200 });

const TempUser = mongoose.model("TempUser", tempUserSchema);
module.exports = TempUser;
