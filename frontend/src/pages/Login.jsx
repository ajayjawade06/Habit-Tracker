import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../utils/AuthContext";
import { useNotification } from "../context/NotificationContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
  };

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await login(email, password);
      if (response.user) {
        showNotification("Login successful! Redirecting...", "success");
        navigate("/dashboard");
      }
    } catch (err) {
      showNotification(err.response?.data?.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-12 bg-black overflow-hidden">
      {/* Left side - Illustration */}
      <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full filter blur-xl animate-pulse delay-200"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 mx-auto text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-white/80 text-lg">Sign in to continue your journey</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="md:col-span-7 flex items-center justify-center p-4 relative">
        <div className="relative w-full max-w-md">
          {/* Animated background elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/30 rounded-full filter blur-xl opacity-70"></div>

          <div className="bg-white/5 backdrop-blur-sm p-5 sm:p-6 rounded-xl shadow-2xl relative z-10 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
            <p className="text-sm sm:text-base text-white/80 text-center mb-4 sm:mb-6">
              Sign in to your account to continue
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base hover:bg-white/10"
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
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base hover:bg-white/10"
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
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in text-sm sm:text-base hover:shadow-lg hover:shadow-purple-500/30"
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

            <p className="mt-6 text-center text-white/80 animate-fade-in" style={{ animationDelay: "1000ms" }}>
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
    </div>
  );
};

export default Login;