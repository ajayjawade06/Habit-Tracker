import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import habitRoutes from "./routes/habits.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie'],
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));


// Enable pre-flight requests for all routes
app.options('*', cors());
app.use(cookieParser());

// Import middleware
import authMiddleware from "./middleware/authMiddleware.js";

// Public routes
app.use("/auth", authRoutes);

// Protected routes
app.use("/dashboard", authMiddleware, dashboardRoutes);
app.use("/habits", authMiddleware, habitRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));