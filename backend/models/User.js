import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  bio: { type: String, default: "" },
  address: { type: String, default: "" },
  resetOTP: { type: String, default: null },
  resetOTPExpiry: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);