import { useNavigate } from "react-router-dom";
import { FiAward, FiTrendingUp, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

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

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const characterVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
      {/* Hero Section with Character */}
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 relative">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={containerVariants}
        >
          {/* Welcoming Character */}
          <motion.div
            className="mb-8"
            variants={characterVariants}
          >
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-lg"
              >
                {/* Simple character face */}
                <circle cx="100" cy="100" r="90" fill="#FFF" />
                <circle cx="70" cy="80" r="10" fill="#333" /> {/* Left eye */}
                <circle cx="130" cy="80" r="10" fill="#333" /> {/* Right eye */}
                <path
                  d="M 70 120 Q 100 150 130 120"
                  stroke="#333"
                  strokeWidth="8"
                  fill="none"
                /> {/* Smile */}
              </svg>
            </div>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            variants={itemVariants}
          >
            Build Better Habits
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
            variants={itemVariants}
          >
            Transform your life through the power of consistent habits. Track, improve, and celebrate your progress.
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => navigate("/register")}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-indigo-600 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Get Started
            </motion.button>
            <motion.button
              onClick={() => navigate("/login")}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Login
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:bg-white/20 transition-all duration-300"
              variants={itemVariants}
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
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/10"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">🔥 Streaks</div>
              <p className="text-white/70">
                Build momentum with daily streaks. Watch your habits grow stronger each day.
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">⭐ Badges</div>
              <p className="text-white/70">
                Earn badges for your achievements. Show off your dedication and progress.
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">📊 Insights</div>
              <p className="text-white/70">
                Track your progress with detailed analytics and performance reports.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
          variants={itemVariants}
        >
          Start Building Better Habits Today
        </motion.h2>
        <motion.p 
          className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Join thousands of others who are transforming their lives through the power of habit tracking.
        </motion.p>
        <motion.button
          onClick={() => navigate("/register")}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Get Started for Free
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;