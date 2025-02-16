import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import sgMail from '@sendgrid/mail';

const router = express.Router();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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


// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      profilePicture: req.file ? `/uploads/profiles/${req.file.filename}` : undefined
    });
    await user.save();

    // Generate JWT token after registration with additional claims
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        isNewRegistration: true // Add flag to indicate new registration
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Set session cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 3600000 // 1 hour
    });

    // Log successful registration
    console.log("New user registered:", { userId: user._id, email: user.email });

    res.status(201).json({ 
      message: "Registration successful. Please log in to continue.",
      success: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        isNewRegistration: true
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

    // Email content with OTP
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Password Reset OTP',
      html: `
        <h1>Password Reset OTP</h1>
        <p>You requested a password reset for your account.</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    try {
      await sgMail.send(msg);
      console.log("Password reset email sent successfully to:", email);
      
      // Always return OTP in development mode
      if (process.env.NODE_ENV === 'development') {
        res.json({ 
          message: "Password reset OTP sent successfully!", 
          otp: otp
        });
      } else {
        res.json({ message: "Password reset OTP sent successfully!" });
      }
    } catch (emailError) {
      console.error("SendGrid error:", emailError);
      if (emailError.response) {
        console.error(emailError.response.body);
      }
      // Return error to client
      res.status(500).json({ 
        message: "Failed to send reset email. Please try again later.",
        error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error("Forgot password error:", {
      error: error.message,
      stack: error.stack,
      email: email
    });
    
    let errorMessage = "Error sending password reset email";
    if (error.message.includes('Email service not configured')) {
      errorMessage = "Email service is temporarily unavailable. Please try again later.";
    }
    
    res.status(500).json({ message: errorMessage });
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