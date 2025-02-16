import { useNavigate } from "react-router-dom";
import { FiAward, FiTrendingUp, FiActivity } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiActivity className="w-6 h-6 text-emerald-400" />,
      title: "Track Daily Habits",
      description: "Build lasting habits with daily tracking and reminders. Stay consistent and achieve your goals."
    },
    {
      icon: <FiAward className="w-6 h-6 text-yellow-400" />,
      title: "Earn Achievements",
      description: "Unlock badges and achievements as you maintain streaks and reach milestones."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6 text-blue-400" />,
      title: "Track Progress",
      description: "Visualize your progress with detailed reports and analytics. See your growth over time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Hero Section */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Build Better Habits
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Transform your life through the power of consistent habits. Track, improve, and celebrate your progress.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 text-sm sm:text-base"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10"
            >
              <div className="bg-white/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🔥 Streaks</div>
              <p className="text-white/70">
                Build momentum with daily streaks. Watch your habits grow stronger each day.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">⭐ Badges</div>
              <p className="text-white/70">
                Earn badges for your achievements. Show off your dedication and progress.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">📊 Insights</div>
              <p className="text-white/70">
                Track your progress with detailed analytics and performance reports.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
          Start Building Better Habits Today
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Join thousands of others who are transforming their lives through the power of habit tracking.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 text-sm sm:text-base"
        >
          Get Started for Free
        </button>
      </div>
    </div>
  );
};

export default Home;