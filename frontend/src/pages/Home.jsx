import { useNavigate } from "react-router-dom";
import { FiAward, FiTrendingUp, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiActivity className="w-6 h-6 text-emerald-400" />,
      title: "Track Daily Habits",
      description: "Build lasting habits with daily tracking and reminders. Stay consistent and achieve your goals.",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=500&q=80"
    },
    {
      icon: <FiAward className="w-6 h-6 text-yellow-400" />,
      title: "Earn Achievements",
      description: "Unlock badges and achievements as you maintain streaks and reach milestones.",
      image: "https://images.unsplash.com/photo-1567942712661-82b9b407abbf?auto=format&fit=crop&w=500&q=80"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6 text-blue-400" />,
      title: "Track Progress",
      description: "Visualize your progress with detailed reports and analytics. See your growth over time.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80"
    }
  ];

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
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
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-3 sm:px-4 relative">
        <motion.div 
          className="text-center"
          initial="initial"
          animate="animate"
          variants={containerVariants}
        >
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
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10"
              variants={itemVariants}
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="p-6">
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
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">🔥 Streaks</div>
              <p className="text-white/70">
                Build momentum with daily streaks. Watch your habits grow stronger each day.
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">⭐ Badges</div>
              <p className="text-white/70">
                Earn badges for your achievements. Show off your dedication and progress.
              </p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">📊 Insights</div>
              <p className="text-white/70">
                Track your progress with detailed analytics and performance reports.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12 text-center"
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
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 text-base"
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