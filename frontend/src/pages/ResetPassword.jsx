import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};
  
  useEffect(() => {
    if (!email || !otp) {
      navigate('/forgot-password');
    }
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await axiosInstance.post(
        `/auth/reset-password`,
        { email, otp, password }
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-12 bg-black overflow-hidden">
      {/* Left side - Illustration */}
      <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-8 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full filter blur-xl animate-pulse delay-200"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 mx-auto text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Create New Password</h2>
          <p className="text-white/80 text-lg">Make sure it&apos;s secure and memorable</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="md:col-span-7 flex items-center justify-center p-4 relative">
        <div className="relative w-full max-w-md">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/30 rounded-full filter blur-xl opacity-70"></div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl shadow-2xl relative z-10 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <h2 className="text-3xl font-bold text-center mb-6 text-white">Reset Password</h2>
            
            <div>
              {success ? (
                <div className="text-center animate-fadeIn">
                  <div className="bg-green-500/20 backdrop-blur-sm p-6 rounded-xl border border-green-500/30 text-white mb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xl font-semibold">Password Reset Successful!</p>
                    <p className="text-white/80 mt-2">Redirecting you to login...</p>
                  </div>
                </div>
              ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-lg text-white">
                  {error}
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-white/60" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 hover:bg-white/10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-white/60" />
                  ) : (
                    <FiEye className="text-white/60" />
                  )}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-white/60" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 hover:bg-white/10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors duration-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="text-white/60" />
                  ) : (
                    <FiEye className="text-white/60" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;