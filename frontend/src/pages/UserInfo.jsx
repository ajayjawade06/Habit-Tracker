import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi';
import { axiosInstance } from '../config';

const UserInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalHabits: 0,
    totalStreaks: 0,
    totalBadges: 0,
    loading: true
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const habitsRes = await axiosInstance.get("/habits");
        const habits = habitsRes.data || [];
        
        // Calculate statistics
        const totalHabits = habits.length;
        const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
        const totalBadges = habits.reduce((sum, habit) => sum + (habit.badges?.length || 0), 0);

        setStats({
          totalHabits,
          totalStreaks,
          totalBadges,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-3 sm:px-4 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300 text-sm sm:text-base"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300"
          >
            <FiEdit2 className="mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-50 blur"></div>
              <img
                src={user?.profilePicture ? `https://habit-tracker-backend-urc7.onrender.com${user.profilePicture}` : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="relative w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 rounded-full object-cover border-2 border-white/20"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{user?.name}</h1>
              <p className="text-white/60 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">{user?.email}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Phone Number</h3>
                    <p className="text-white text-lg">{user?.phoneNumber || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Address</h3>
                    <p className="text-white text-lg">{user?.address || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white/80 text-sm font-medium mb-1">Bio</h3>
                  <p className="text-white text-lg">{user?.bio || 'No bio provided'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                <h3 className="text-white/60 text-xs sm:text-sm mb-1">Total Habits</h3>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.loading ? (
                    <span className="inline-block w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></span>
                  ) : stats.totalHabits}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                <h3 className="text-white/60 text-xs sm:text-sm mb-1">Active Streaks</h3>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.loading ? (
                    <span className="inline-block w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></span>
                  ) : stats.totalStreaks}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                <h3 className="text-white/60 text-xs sm:text-sm mb-1">Badges Earned</h3>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.loading ? (
                    <span className="inline-block w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></span>
                  ) : stats.totalBadges}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;