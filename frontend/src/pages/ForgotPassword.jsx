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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl relative z-10 border border-white/20 transform hover:scale-[1.01] transition-all duration-300">
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
              <div className="bg-green-500/20 backdrop-blur-sm p-6 rounded-xl border border-green-500/30">
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
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300"
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
                    className="w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300"
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
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>

              {!showOtpInput && (
                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};

export default ForgotPassword;