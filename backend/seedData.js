import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Habit from "./models/Habit.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected for seeding data");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Function to generate random completion history
const generateCompletionHistory = (startDate, endDate, completionRate, frequency) => {
  const completionHistory = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    // For weekly habits, only consider once per week
    if (frequency === 'weekly' && currentDate.getDay() !== 1) { // Only Mondays for weekly habits
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Randomly determine if habit was completed based on completion rate
    if (Math.random() < completionRate) {
      completionHistory.push({
        date: new Date(currentDate),
        completed: true
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return completionHistory;
};

// Function to calculate streak and badges based on completion history
const calculateStreakAndBadges = (habit) => {
  // Sort completion history by date
  const sortedHistory = [...habit.completionHistory].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  let lastDate = null;
  
  // Calculate streaks
  for (let i = 0; i < sortedHistory.length; i++) {
    const completion = sortedHistory[i];
    const completionDate = new Date(completion.date);
    
    if (lastDate === null) {
      currentStreak = 1;
    } else {
      const dayDiff = Math.floor((completionDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if ((habit.frequency === 'daily' && dayDiff === 1) || 
          (habit.frequency === 'weekly' && dayDiff <= 7)) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }
    
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    
    lastDate = completionDate;
  }
  
  habit.currentStreak = currentStreak;
  habit.longestStreak = longestStreak;
  habit.totalCompletions = sortedHistory.length;
  
  // Add badges based on streaks and completions
  const badges = [];
  
  if (longestStreak >= 7) {
    badges.push({
      name: "Week Warrior",
      description: "Maintained a 7-day streak!",
      icon: "🔥",
      dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    });
  }
  
  if (longestStreak >= 30) {
    badges.push({
      name: "Monthly Master",
      description: "Maintained a 30-day streak!",
      icon: "⭐",
      dateEarned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    });
  }
  
  if (sortedHistory.length >= 100) {
    badges.push({
      name: "Century Club",
      description: "Completed the habit 100 times!",
      icon: "💯",
      dateEarned: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    });
  }
  
  habit.badges = badges;
  habit.lastCompleted = sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].date : null;
  
  return habit;
};

// Main function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Habit.deleteMany({});
    
    // Check if test user exists, create if not
    let testUser = await User.findOne({ email: "test@example.com" });
    
    if (!testUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      
      testUser = await User.create({
        name: "Ajay Jawade",
        email: "test@example.com",
        password: hashedPassword,
        isVerified: true
      });
      
      console.log("Created test user:", testUser.email);
    } else {
      console.log("Using existing test user:", testUser.email);
    }
    
    // Define habit templates
    const habitTemplates = [
      {
        title: "Drink 8 glasses of water",
        description: "Stay hydrated throughout the day",
        category: "health",
        frequency: "daily",
        timeOfDay: "anytime",
        completionRate: 0.9 // 90% completion rate
      },
      {
        title: "Take vitamins",
        description: "Daily supplements for health",
        category: "health",
        frequency: "daily",
        timeOfDay: "morning",
        completionRate: 0.85
      },
      {
        title: "Plan daily tasks",
        description: "Organize tasks for the day",
        category: "productivity",
        frequency: "daily",
        timeOfDay: "morning",
        completionRate: 0.75
      },
      {
        title: "Check and respond to emails",
        description: "Stay on top of communication",
        category: "productivity",
        frequency: "daily",
        timeOfDay: "afternoon",
        completionRate: 0.8
      },
      {
        title: "Study programming",
        description: "Learn new programming concepts",
        category: "learning",
        frequency: "daily",
        timeOfDay: "evening",
        completionRate: 0.7
      },
      {
        title: "Read a book",
        description: "Read at least 30 minutes",
        category: "learning",
        frequency: "daily",
        timeOfDay: "evening",
        completionRate: 0.65
      },
      {
        title: "Go for a run",
        description: "30 minutes of cardio",
        category: "fitness",
        frequency: "daily",
        timeOfDay: "morning",
        completionRate: 0.6
      },
      {
        title: "Strength training",
        description: "Workout focusing on strength",
        category: "fitness",
        frequency: "weekly",
        timeOfDay: "afternoon",
        completionRate: 0.8
      },
      {
        title: "Meditate",
        description: "10 minutes of mindfulness meditation",
        category: "mindfulness",
        frequency: "daily",
        timeOfDay: "morning",
        completionRate: 0.7
      },
      {
        title: "Practice gratitude",
        description: "Write down three things you're grateful for",
        category: "mindfulness",
        frequency: "daily",
        timeOfDay: "evening",
        completionRate: 0.75
      },
      {
        title: "Weekly meal prep",
        description: "Prepare meals for the week",
        category: "health",
        frequency: "weekly",
        timeOfDay: "afternoon",
        completionRate: 0.9
      },
      {
        title: "Clean living space",
        description: "Tidy up your environment",
        category: "productivity",
        frequency: "weekly",
        timeOfDay: "afternoon",
        completionRate: 0.85
      }
    ];
    
    // Create habits with completion history
    const endDate = new Date(); // Today
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60); // 60 days ago
    
    const habitPromises = habitTemplates.map(template => {
      // Create basic habit
      const habit = new Habit({
        user: testUser._id,
        title: template.title,
        description: template.description,
        category: template.category,
        frequency: template.frequency,
        timeOfDay: template.timeOfDay,
        startDate: startDate
      });
      
      // Generate completion history
      habit.completionHistory = generateCompletionHistory(
        startDate, 
        endDate, 
        template.completionRate,
        template.frequency
      );
      
      // Calculate streaks and add badges
      calculateStreakAndBadges(habit);
      
      return habit.save();
    });
    
    await Promise.all(habitPromises);
    
    console.log(`Successfully seeded ${habitTemplates.length} habits with completion history and badges`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};