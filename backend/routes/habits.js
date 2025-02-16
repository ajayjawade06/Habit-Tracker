import express from "express";
import Habit from "../models/Habit.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new habit
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, frequency, timeOfDay } = req.body;
    
    const habit = new Habit({
      user: req.user.id,
      title,
      description,
      category,
      frequency,
      timeOfDay
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.error("Error creating habit:", error);
    res.status(500).json({ message: "Error creating habit" });
  }
});

// Get all habits for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user.id,
      active: true 
    }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    res.status(500).json({ message: "Error fetching habits" });
  }
});

// Update a habit
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== 'user' && key !== 'completionHistory' && key !== 'badges') {
        habit[key] = updates[key];
      }
    });

    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error("Error updating habit:", error);
    res.status(500).json({ message: "Error updating habit" });
  }
});

// Mark habit as completed
router.post("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      _id: req.params.id,
      user: req.user.id 
    });
    
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const completionDate = new Date();
    
    // Add to completion history
    habit.completionHistory.push({ 
      date: completionDate,
      completed: true
    });
    
    habit.lastCompleted = completionDate;
    habit.totalCompletions += 1;
    
    // Update streak
    habit.updateStreak(completionDate);
    
    // Check for new badges
    const newBadges = habit.checkAndAwardBadges();
    
    await habit.save();
    
    res.json({
      habit,
      newBadges,
      message: "Habit marked as completed"
    });
  } catch (error) {
    console.error("Error completing habit:", error);
    res.status(500).json({ message: "Error completing habit" });
  }
});

// Soft delete a habit
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.active = false;
    await habit.save();

    res.json({ message: "Habit archived successfully" });
  } catch (error) {
    console.error("Error archiving habit:", error);
    res.status(500).json({ message: "Error archiving habit" });
  }
});

// Get habit statistics
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user.id,
      active: true 
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Calculate completion rate for last 30 days
    const completionStats = habits.map(habit => {
      const recentCompletions = habit.completionHistory.filter(
        completion => completion.date >= thirtyDaysAgo
      );

      return {
        habitId: habit._id,
        title: habit.title,
        category: habit.category,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        totalCompletions: habit.totalCompletions,
        completionRate: (recentCompletions.length / 30) * 100,
        badges: habit.badges
      };
    });

    // Category-wise analysis
    const categoryStats = habits.reduce((acc, habit) => {
      if (!acc[habit.category]) {
        acc[habit.category] = {
          total: 0,
          completed: 0,
          avgStreak: 0
        };
      }
      
      acc[habit.category].total++;
      acc[habit.category].completed += habit.totalCompletions;
      acc[habit.category].avgStreak += habit.currentStreak;
      
      return acc;
    }, {});

    // Calculate averages for each category
    Object.keys(categoryStats).forEach(category => {
      const categoryData = categoryStats[category];
      categoryData.avgStreak = categoryData.avgStreak / categoryData.total;
    });

    // Overall statistics
    const overallStats = {
      totalHabits: habits.length,
      totalCompletions: habits.reduce((sum, habit) => sum + habit.totalCompletions, 0),
      avgStreak: habits.reduce((sum, habit) => sum + habit.currentStreak, 0) / habits.length,
      totalBadges: habits.reduce((sum, habit) => sum + habit.badges.length, 0)
    };

    res.json({
      habits: completionStats,
      categoryStats,
      overallStats
    });
  } catch (error) {
    console.error("Error generating habit statistics:", error);
    res.status(500).json({ message: "Error generating habit statistics" });
  }
});

// Get monthly report
router.get("/report/monthly", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const habits = await Habit.find({
      user: req.user.id,
      active: true
    });

    const monthlyStats = habits.map(habit => {
      const monthlyCompletions = habit.completionHistory.filter(
        completion => completion.date >= startDate && completion.date <= endDate
      );

      const daysInMonth = endDate.getDate();
      const completionRate = (monthlyCompletions.length / daysInMonth) * 100;

      return {
        habitId: habit._id,
        title: habit.title,
        category: habit.category,
        completions: monthlyCompletions.length,
        completionRate,
        streakInMonth: habit.currentStreak,
        badgesEarnedInMonth: habit.badges.filter(
          badge => badge.dateEarned >= startDate && badge.dateEarned <= endDate
        )
      };
    });

    res.json({
      period: `${month}/${year}`,
      habits: monthlyStats,
      summary: {
        totalCompletions: monthlyStats.reduce((sum, stat) => sum + stat.completions, 0),
        averageCompletionRate: monthlyStats.reduce((sum, stat) => sum + stat.completionRate, 0) / habits.length,
        totalBadgesEarned: monthlyStats.reduce((sum, stat) => sum + stat.badgesEarnedInMonth.length, 0)
      }
    });
  } catch (error) {
    console.error("Error generating monthly report:", error);
    res.status(500).json({ message: "Error generating monthly report" });
  }
});

export default router;