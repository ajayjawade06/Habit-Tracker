import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../config";
import { FiMail, FiArrowLeft, FiSend, FiLock } from "react-icons/fi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      setShowOtpInput(true);
      setSuccess(true);
      // In development mode, OTP will be in the response
      if (response.data.otp) {
        setOtp(response.data.otp);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again later.");
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Forgot Your Password?</h2>
          <p className="text-white/80 text-lg">Don&apos;t worry, we&apos;ll help you reset it</p>
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
          <Link
            to="/login"
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-all duration-300 group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm">Back to Login</span>
          </Link>

          <h2 className="text-4xl font-bold text-white mb-2 text-center">Reset Password</h2>
          <p className="text-white/80 text-center mb-8">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </p>

          {success ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                    <FiSend className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-white text-center font-medium">
                  Password reset OTP sent!
                </p>
                <p className="text-white/80 text-center text-sm mt-2">
                  {otp ? `Your OTP is: ${otp}` : "Check your email for the OTP."}
                </p>
              </div>

              <div className="space-y-4">
                {showOtpInput && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 hover:bg-white/10"
                      required
                      maxLength={6}
                    />
                  </div>
                )}
                {showOtpInput && (
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await axiosInstance.post("/auth/verify-otp", { email, otp });
                        navigate(`/reset-password`, { state: { email, otp } });
                      } catch (err) {
                        setError(err.response?.data?.message || "Invalid OTP");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                    disabled={loading || !otp}
                  >
                    Verify OTP
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendOTP} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30 text-white animate-shake">
                  {error}
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 hover:bg-white/10"
                  required
                  disabled={loading}
                />
              </div>

              {!showOtpInput && (
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/30"
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
                      <FiSend className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    )}
                    {loading ? "Sending..." : "Send OTP"}
                  </span>
                </button>
              )}
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;