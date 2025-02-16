import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Habit from "../models/Habit.js";

const router = express.Router();

// Fetch user details with habit summary
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get habit summary
    const habits = await Habit.find({ user: req.user.id, active: true });
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
    const totalBadges = habits.reduce((sum, habit) => sum + habit.badges.length, 0);
    const longestStreak = Math.max(...habits.map(habit => habit.longestStreak), 0);
    
    // Get habits completed today
    const today = new Date();
    const habitsCompletedToday = habits.filter(habit => {
      if (!habit.lastCompleted) return false;
      const lastCompleted = new Date(habit.lastCompleted);
      return (
        lastCompleted.getDate() === today.getDate() &&
        lastCompleted.getMonth() === today.getMonth() &&
        lastCompleted.getFullYear() === today.getFullYear()
      );
    }).length;

    res.json({
      user,
      habitSummary: {
        totalHabits,
        totalCompletions,
        totalBadges,
        longestStreak,
        habitsCompletedToday,
        activeStreaks: habits.map(habit => ({
          habitId: habit._id,
          title: habit.title,
          currentStreak: habit.currentStreak
        }))
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get recent achievements
router.get("/achievements", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, active: true });
    
    // Collect all badges with habit information
    const achievements = habits.flatMap(habit => 
      habit.badges.map(badge => ({
        habitId: habit._id,
        habitTitle: habit.title,
        badge: {
          ...badge,
          dateEarned: new Date(badge.dateEarned)
        }
      }))
    );

    // Sort by date earned, most recent first
    achievements.sort((a, b) => b.badge.dateEarned - a.badge.dateEarned);

    res.json(achievements.slice(0, 10)); // Return 10 most recent achievements
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({ message: "Error fetching achievements" });
  }
});

export default router;
