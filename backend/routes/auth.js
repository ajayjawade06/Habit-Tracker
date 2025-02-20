import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import { generateOTP, sendOTPEmail, sendVerificationEmail } from "../utils/emailService.js";

const router = express.Router();

// Email Verification Route
router.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        message: "Email is already verified",
        redirectTo: "/login"
      });
    }

    // Check if OTP exists
    if (!user.verificationOTP || !user.verificationOTPExpiry) {
      return res.status(400).json({ 
        message: "No verification code found. Please register again or request a new code." 
      });
    }

    // Check if OTP is expired
    if (user.verificationOTPExpiry < Date.now()) {
      return res.status(400).json({ 
        message: "Verification code has expired. Please request a new one.",
        expired: true
      });
    }

    // Verify OTP
    if (user.verificationOTP !== otp.trim()) {
      return res.status(400).json({ 
        message: "Invalid verification code. Please check and try again." 
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationOTP = null;
    user.verificationOTPExpiry = null;
    await user.save();

    res.json({ 
      message: "Email verified successfully",
      redirectTo: "/login"
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
});

// Resend Verification Code
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(404).json({ message: "User not found or already verified" });
    }

    // Generate new OTP
    const verificationOTP = generateOTP();
    user.verificationOTP = verificationOTP;
    user.verificationOTPExpiry = new Date(Date.now() + 600000); // 10 minutes
    await user.save();

    // Send new verification email
    await sendVerificationEmail(email, verificationOTP, user.name);

    res.json({ message: "Verification code resent successfully" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Error resending verification code" });
  }
});

// Update Email During Verification
router.post("/update-verification-email", async (req, res) => {
  try {
    const { email, oldEmail } = req.body;
    
    // Check if new email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const user = await User.findOne({ email: oldEmail, isVerified: false });
    if (!user) {
      return res.status(404).json({ message: "User not found or already verified" });
    }

    // Generate new OTP
    const verificationOTP = generateOTP();
    user.email = email;
    user.verificationOTP = verificationOTP;
    user.verificationOTPExpiry = new Date(Date.now() + 600000); // 10 minutes
    await user.save();

    // Send verification email to new address
    await sendVerificationEmail(email, verificationOTP, user.name);

    res.json({ message: "Email updated and verification code sent" });
  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).json({ message: "Error updating email" });
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({ 
      email,
      resetOTP: otp,
      resetOTPExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update user
    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message
    });
  }
});

// User Registration
router.post("/register", upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Generate verification OTP
    const verificationOTP = generateOTP();
    const verificationOTPExpiry = new Date(Date.now() + 600000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with verification details
    user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      profilePicture: req.file ? `/uploads/profiles/${req.file.filename}` : undefined,
      verificationOTP,
      verificationOTPExpiry,
      isVerified: false
    });
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationOTP, name);

    // Generate JWT token for temporary access
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        isNewRegistration: true // Add flag to indicate new registration
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(201).json({ 
      message: "Registration successful. Please check your email for verification code.",
      success: true,
      requiresVerification: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email
      }
    });
  } catch (error) {
    console.error("Registration error:", {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    // Send appropriate error message
    if (error.name === 'ValidationError') {
      res.status(400).json({ 
        message: "Invalid input data", 
        errors: Object.values(error.errors).map(err => err.message)
      });
    } else {
      res.status(500).json({ 
        message: "Server error during registration",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// Fix cookie settings in login route
res.cookie("token", token, {
  httpOnly: true,
  secure: false, 
  sameSite: "lax", 
  path: "/",
  maxAge: 3600000 // 1 hour
});


    res.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 600000; // 10 minutes expiry
    await user.save();

    // Send OTP via email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent) {
      return res.status(500).json({ 
        message: "Failed to send reset email. Please try again later." 
      });
    }

    // Return response based on environment
    if (process.env.NODE_ENV === 'development') {
      res.json({ 
        message: "Password reset OTP sent successfully!", 
        otp: otp  // Only in development mode
      });
    } else {
      res.json({ message: "Password reset OTP sent successfully!" });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      message: "Error processing password reset request",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update Profile Route (Protected)
router.put("/profile/update", upload.single('profilePicture'), async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (req.body.name) user.name = req.body.name;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.address) user.address = req.body.address;
    
    // Update profile picture if uploaded
    if (req.file) {
      user.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    // Return updated user data without password
    const updatedUser = await User.findById(user._id).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// Get User Data (Protected Route)
router.get("/dashboard/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(401).json({ message: "Invalid Token" });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  res.json({ message: "Logged out successfully" });
});

export default router;