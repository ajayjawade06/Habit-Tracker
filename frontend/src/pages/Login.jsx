import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
  };

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await login(email, password);
      if (response.user) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-3 sm:p-4">
      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Animated background elements */}
        <div className="absolute -top-16 sm:-top-20 -left-16 sm:-left-20 w-56 sm:w-72 h-56 sm:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-32 sm:top-40 -right-16 sm:-right-20 w-56 sm:w-72 h-56 sm:h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-16 sm:-bottom-20 left-16 sm:left-20 w-56 sm:w-72 h-56 sm:h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10 border border-white/20 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center">Welcome Back</h2>
          <p className="text-sm sm:text-base text-white/80 text-center mb-6 sm:mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30 text-white mb-6 animate-shake">
                {error}
              </div>
            )}

            <div className="relative group animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <div className="relative group animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm animate-fade-in" style={{ animationDelay: "600ms" }}>
              <Link
                to="/forgot-password"
                className="text-white/80 hover:text-white transition-colors duration-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in text-sm sm:text-base"
              style={{ animationDelay: "800ms" }}
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <FiLogIn className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-white/80 animate-fade-in" style={{ animationDelay: "1000ms" }}>
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-white hover:underline transition-all duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;