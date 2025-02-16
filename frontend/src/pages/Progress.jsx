import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { axiosInstance } from "../config";
import { useAuth } from "../utils/AuthContext";

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }
        const statsRes = await axiosInstance.get("/habits/stats");
        setStats(statsRes.data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, user]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "health": return "💪";
      case "productivity": return "💻";
      case "learning": return "📚";
      case "fitness": return "🏃‍♂️";
      case "mindfulness": return "🧘‍♂️";
      default: return "✨";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="animate-spin h-12 w-12 border-4 border-white rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-3 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-red-500/30 text-white mb-4 sm:mb-6 animate-shake">
            {error}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Your Progress</h1>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300 flex items-center text-sm sm:text-base"
              >
                <FiArrowLeft className="mr-2" />
                Back to Dashboard
            </button>
          </div>

          {stats && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Total Habits</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{stats.overallStats.totalHabits}</p>
                </div>
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Total Completions</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{stats.overallStats.totalCompletions}</p>
                </div>
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Average Streak</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{Math.round(stats.overallStats.avgStreak)} days</p>
                </div>
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Total Badges</h3>
                  <p className="text-2xl sm:text-3xl lg:text-4xl text-white">{stats.overallStats.totalBadges}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Category Performance</h3>
                  <div className="space-y-4">
                    {Object.entries(stats.categoryStats).map(([category, data]) => (
                      <div key={category} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white capitalize flex items-center">
                            {getCategoryIcon(category)} <span className="ml-2">{category}</span>
                          </span>
                          <span className="text-white font-semibold">
                            {Math.round(data.avgStreak)} day streak
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (data.completed / data.total) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Top Performing Habits</h3>
                  <div className="space-y-4">
                    {stats.habits
                      .sort((a, b) => b.completionRate - a.completionRate)
                      .slice(0, 5)
                      .map(habit => (
                        <div key={habit.habitId} className="bg-white/5 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white">{habit.title}</span>
                            <span className="text-white font-semibold">
                              {Math.round(habit.completionRate)}% complete
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                              style={{ width: `${habit.completionRate}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Badges Collection</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {stats.habits.flatMap(habit => 
                    habit.badges.map((badge, index) => (
                      <div key={`${habit.habitId}-${index}`} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <h4 className="text-white font-semibold">{badge.name}</h4>
                            <p className="text-white/70 text-sm">{habit.title}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;