import mongoose from "mongoose";

const CompletionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  dateEarned: {
    type: Date,
    required: true
  }
}, { _id: false });

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ["health", "productivity", "learning", "fitness", "mindfulness", "other"],
    default: "other"
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly"],
    default: "daily"
  },
  timeOfDay: {
    type: String,
    enum: ["morning", "afternoon", "evening", "anytime"],
    default: "anytime"
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  completionHistory: [CompletionSchema],
  badges: [BadgeSchema],
  lastCompleted: {
    type: Date,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for querying habits by user and date
HabitSchema.index({ user: 1, "completionHistory.date": 1 });

// Method to check if habit was completed today
HabitSchema.methods.isCompletedToday = function() {
  if (!this.lastCompleted) return false;
  const today = new Date();
  const lastCompleted = new Date(this.lastCompleted);
  return (
    lastCompleted.getDate() === today.getDate() &&
    lastCompleted.getMonth() === today.getMonth() &&
    lastCompleted.getFullYear() === today.getFullYear()
  );
};

// Method to update streak
HabitSchema.methods.updateStreak = function(completionDate) {
  const today = new Date(completionDate);
  
  // If already completed today, don't update streak again
  const alreadyCompletedToday = this.completionHistory.some(completion => {
    if (!completion.completed) return false;
    
    const compDate = new Date(completion.date);
    return (
      compDate.getDate() === today.getDate() &&
      compDate.getMonth() === today.getMonth() &&
      compDate.getFullYear() === today.getFullYear() &&
      // Exclude the current completion we're processing
      compDate.getTime() < today.getTime()
    );
  });
  
  if (alreadyCompletedToday) {
    return; // Already completed today, no need to update streak
  }
  
  if (this.frequency === 'daily') {
    // For daily habits, check if completed yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const wasCompletedYesterday = this.completionHistory.some(completion => {
      if (!completion.completed) return false;
      
      const compDate = new Date(completion.date);
      return (
        compDate.getDate() === yesterday.getDate() &&
        compDate.getMonth() === yesterday.getMonth() &&
        compDate.getFullYear() === yesterday.getFullYear()
      );
    });
    
    if (wasCompletedYesterday) {
      this.currentStreak += 1;
    } else {
      this.currentStreak = 1;
    }
  } else if (this.frequency === 'weekly') {
    // For weekly habits, check if completed in the last week
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Find the most recent completion before today
    const recentCompletions = this.completionHistory
      .filter(completion => completion.completed && new Date(completion.date) < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (recentCompletions.length > 0) {
      const lastCompletionDate = new Date(recentCompletions[0].date);
      
      // Check if the last completion was within the last week
      if (lastCompletionDate >= oneWeekAgo) {
        this.currentStreak += 1;
      } else {
        this.currentStreak = 1;
      }
    } else {
      // First completion
      this.currentStreak = 1;
    }
  }
  
  // Update longest streak if current streak is greater
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
};

// Method to check and award badges
HabitSchema.methods.checkAndAwardBadges = function() {
  const newBadges = [];

  // Streak badges
  if (this.currentStreak >= 7 && !this.badges.some(b => b.name === "Week Warrior")) {
    newBadges.push({
      name: "Week Warrior",
      description: "Maintained a 7-day streak!",
      icon: "🔥",
      dateEarned: new Date()
    });
  }

  if (this.currentStreak >= 30 && !this.badges.some(b => b.name === "Monthly Master")) {
    newBadges.push({
      name: "Monthly Master",
      description: "Maintained a 30-day streak!",
      icon: "⭐",
      dateEarned: new Date()
    });
  }

  // Completion badges
  if (this.totalCompletions >= 100 && !this.badges.some(b => b.name === "Century Club")) {
    newBadges.push({
      name: "Century Club",
      description: "Completed the habit 100 times!",
      icon: "💯",
      dateEarned: new Date()
    });
  }

  this.badges.push(...newBadges);
  return newBadges;
};

export default mongoose.model("Habit", HabitSchema);