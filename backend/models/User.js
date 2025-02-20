import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  bio: { type: String, default: "" },
  address: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  verificationOTP: { type: String, default: null },
  verificationOTPExpiry: { type: Date, default: null },
  resetOTP: { type: String, default: null },
  resetOTPExpiry: { type: Date, default: null },
}, { timestamps: true });

// Add index for OTP expiry to automatically clean up expired codes
UserSchema.index({ verificationOTPExpiry: 1 }, { expireAfterSeconds: 0 });
UserSchema.index({ resetOTPExpiry: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("User", UserSchema);