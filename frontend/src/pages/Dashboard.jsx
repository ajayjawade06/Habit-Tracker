import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiAward, FiTrendingUp, FiCalendar, FiLogIn, FiEdit2, FiTrash2, FiUser } from "react-icons/fi";
import { axiosInstance } from "../config";
import { useAuth } from "../utils/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showEditHabit, setShowEditHabit] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    category: "other",
    frequency: "daily",
    timeOfDay: "anytime"
  });
  const navigate = useNavigate();

  const fetchUserAndHabits = useCallback(async () => {
    try {
      const habitsRes = await axiosInstance.get("/habits").catch(() => ({ data: [] }));
  
      if (!user) {
        navigate("/login");
        return;
      }
      setHabits(habitsRes.data || []);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    fetchUserAndHabits();
  }, [fetchUserAndHabits]);

  const handleEditHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/habits/${selectedHabit._id}`, selectedHabit);
      setHabits(habits.map(h => h._id === selectedHabit._id ? res.data : h));
      setShowEditHabit(false);
      setSelectedHabit(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating habit");
    }
  };

  const handleDeleteHabit = async () => {
    try {
      await axiosInstance.delete(`/habits/${selectedHabit._id}`);
      setHabits(habits.filter(h => h._id !== selectedHabit._id));
      setShowDeleteConfirm(false);
      setSelectedHabit(null);
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting habit");
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/habits", newHabit);
      setHabits([...habits, res.data]);
      setShowAddHabit(false);
      setNewHabit({
        title: "",
        description: "",
        category: "other",
        frequency: "daily",
        timeOfDay: "anytime"
      });
    } catch (error) {
      setError(error.response?.data?.message || "Error creating habit");
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      const res = await axiosInstance.post(`/habits/${habitId}/complete`);
      
      // Update habits list with new completion data
      setHabits(habits.map(habit => 
        habit._id === habitId ? res.data.habit : habit
      ));

      // Show badge notification if earned
      if (res.data.newBadges?.length > 0) {
        // You could implement a toast notification here
        console.log("New badges earned!", res.data.newBadges);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error completing habit");
    }
  };

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
    <div className="min-h-screen bg-black">
      {/* Enhanced Navigation Bar */}
      <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <img
                  src={user?.profilePicture ? `http://localhost:5003${user.profilePicture}` : 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/20"
                />
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Welcome, {user?.name}</h1>
                  <p className="text-white/60 text-xs sm:text-sm">Track your habits and achieve your goals</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={() => navigate("/progress")}
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 flex items-center text-sm md:text-base"
                >
                  <FiTrendingUp className="mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">View Progress</span>
                  <span className="sm:hidden">Progress</span>
                </button>
                <button
                  onClick={() => navigate("/user-info")}
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 flex items-center text-sm md:text-base"
                >
                  <FiUser className="mr-2" />
                  View User Info
                </button>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="group relative"
              >
                <img
                  src={user?.profilePicture ? `http://localhost:5003${user.profilePicture}` : 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20 transition-all duration-300 group-hover:border-white/40"
                />
                <div className="absolute -bottom-1 -right-1 bg-white/10 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                    <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 flex items-center font-medium border border-white/10"
              >
                <FiLogIn className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-red-500/30 text-white mb-4 sm:mb-6 animate-shake">
            {error}
          </div>
        )}

        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/10 hover:bg-white/10 transition-all duration-300">

          <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <button
                onClick={() => setShowAddHabit(!showAddHabit)}
                className="flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 text-sm sm:text-base"
              >
                <FiPlus className="mr-1 sm:mr-2" />
                Add New Habit
              </button>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-800 [&>option]:text-white text-sm sm:text-base hover:bg-white/10 transition-all duration-300"
              >
                <option value="all">All Categories</option>
                <option value="health">Health</option>
                <option value="productivity">Productivity</option>
                <option value="learning">Learning</option>
                <option value="fitness">Fitness</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="other">Other</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-800 [&>option]:text-white hover:bg-white/10 transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="streak">Sort by Streak</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>

          {showAddHabit && (
            <form onSubmit={handleAddHabit} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <input
                  type="text"
                  placeholder="Habit Title"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:bg-white/10"
                  required
                />
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white [&>option]:bg-gray-800 [&>option]:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <option value="health">Health</option>
                  <option value="productivity">Productivity</option>
                  <option value="learning">Learning</option>
                  <option value="fitness">Fitness</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <select
                  value={newHabit.timeOfDay}
                  onChange={(e) => setNewHabit({...newHabit, timeOfDay: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="anytime">Anytime</option>
                </select>
                <textarea
                  placeholder="Description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-white/20 rounded-lg text-white placeholder-white/60 md:col-span-2"
                  rows="3"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  Create Habit
                </button>
              </div>
            </form>
          )}


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {habits
              .filter(habit => filterCategory === "all" || habit.category === filterCategory)
              .sort((a, b) => {
                if (sortBy === "name") return a.title.localeCompare(b.title);
                if (sortBy === "streak") return b.currentStreak - a.currentStreak;
                if (sortBy === "category") return a.category.localeCompare(b.category);
                return 0;
              })
              .map((habit) => (
              <div
                key={habit._id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-4 relative group">
                  <div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white">{habit.title}</h3>
                    <span className="text-white/60 text-sm">
                      {getCategoryIcon(habit.category)} {habit.category.charAt(0).toUpperCase() + habit.category.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white/80">🔥 {habit.currentStreak}</span>
                  </div>
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedHabit(habit);
                        setShowEditHabit(true);
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedHabit(habit);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-white"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4">{habit.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <FiCalendar className="text-white/60" />
                  <span className="text-white/80">
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </span>
                </div>

                {habit.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {habit.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white"
                        title={badge.description}
                      >
                        {badge.icon} {badge.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <FiAward className="text-yellow-500" />
                    <span className="text-white/80">Best: {habit.longestStreak} days</span>
                  </div>
                  {(!habit.lastCompleted || new Date(habit.lastCompleted).toDateString() !== new Date().toDateString()) && (
                    <button
                      onClick={() => handleCompleteHabit(habit._id)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Habit Modal */}
        {showEditHabit && selectedHabit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full mx-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Edit Habit</h2>
              <form onSubmit={handleEditHabit} className="space-y-4 sm:space-y-6">
                <input
                  type="text"
                  value={selectedHabit.title}
                  onChange={(e) => setSelectedHabit({...selectedHabit, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white"
                  required
                />
                <select
                  value={selectedHabit.category}
                  onChange={(e) => setSelectedHabit({...selectedHabit, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white [&>option]:bg-gray-800 [&>option]:text-white"
                >
                  <option value="health">Health</option>
                  <option value="productivity">Productivity</option>
                  <option value="learning">Learning</option>
                  <option value="fitness">Fitness</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  value={selectedHabit.description}
                  onChange={(e) => setSelectedHabit({...selectedHabit, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  rows="3"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditHabit(false);
                      setSelectedHabit(null);
                    }}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedHabit && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 lg:p-8 max-w-md w-full mx-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Delete Habit</h2>
              <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete &ldquo;{selectedHabit.title}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedHabit(null);
                  }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 text-white rounded-xl text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteHabit}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500/80 hover:bg-red-500 text-white rounded-xl text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;