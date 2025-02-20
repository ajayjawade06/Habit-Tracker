import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiCheck, FiEdit2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const locationEmail = location.state?.email;
    if (!locationEmail) {
      navigate('/register');
      return;
    }
    setEmail(locationEmail);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.state?.email, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-email', {
        email,
        otp: otp.trim()
      });

      if (response.data.redirectTo) {
        navigate(response.data.redirectTo, {
          state: { message: 'Email verified successfully! Please log in.' }
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed';
      setError(errorMessage);
      
      // Handle specific error cases
      if (err.response?.data?.expired) {
        setCountdown(0); // Show resend button immediately
      }
      
      // If already verified, redirect to login
      if (err.response?.data?.redirectTo) {
        setTimeout(() => {
          navigate(err.response.data.redirectTo);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post('/api/auth/resend-verification', { email });
      setCountdown(600);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await axios.post('/api/auth/update-verification-email', { 
        email,
        oldEmail: location.state?.email 
      });
      setIsEditingEmail(false);
      setCountdown(600);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="relative w-full max-w-md">
        {/* Animated background elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl relative z-10 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FiMail className="text-white text-3xl" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
            
            <div className="relative mt-4 mb-6">
              {isEditingEmail ? (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    placeholder="Enter your email"
                  />
                  <button
                    onClick={handleUpdateEmail}
                    className="px-4 py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-white/80">
                  <span className="font-medium">{email}</span>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="text-white/60 hover:text-white transition-colors duration-300"
                  >
                    <FiEdit2 />
                  </button>
                </div>
              )}
            </div>

            {countdown > 0 && (
              <p className="text-white/60 text-sm">
                Code expires in: {formatTime(countdown)}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30 text-white mb-6 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 text-center text-2xl tracking-widest"
                required
                disabled={loading || countdown === 0}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || countdown === 0}
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
                  <FiCheck className="mr-2" />
                )}
                {loading ? "Verifying..." : "Verify Email"}
              </span>
            </button>
          </form>

          {countdown === 0 ? (
            <button
              onClick={handleResendOTP}
              className="w-full mt-4 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300"
            >
              Resend Verification Code
            </button>
          ) : (
            <p className="text-white/60 text-sm text-center mt-4">
              Didn&apos;t receive the code? You can request a new one when the timer expires.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;