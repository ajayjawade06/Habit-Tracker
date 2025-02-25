import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiCheck, FiEdit2, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../utils/AuthContext';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
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

  const { verifyEmail, resendVerificationOTP, updateVerificationEmail } = useAuth();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyEmail(email, otp);
      if (result.success) {
        setVerificationSuccess(true);
        // Wait for animation to complete before redirecting
        setTimeout(() => {
          navigate('/login', {
            state: { message: result.message || 'Email verified successfully! Please log in.' }
          });
        }, 2000); // Match this with animation duration
      }
    } catch (err) {
      const errorMessage = err.message || 'Verification failed';
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
      const result = await resendVerificationOTP(email);
      if (result.success) {
        setCountdown(600);
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend verification code. Please try again.');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const result = await updateVerificationEmail(email, location.state?.email);
      if (result.success) {
        setIsEditingEmail(false);
        setCountdown(600);
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to update email. Please try again.');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Almost There!</h2>
          <p className="text-white/80 text-lg">Check your email for the verification code</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="md:col-span-7 flex items-center justify-center p-4 relative">
        {/* Success Animation - Spans full screen */}
        <AnimatePresence>
          {verificationSuccess && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Success Message */}
              <motion.div
                className="absolute text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1, 0.8],
                  transition: { 
                    duration: 2,
                    times: [0, 0.2, 0.8, 1]
                  }
                }}
              >
                <h2 className="text-4xl font-bold text-white mb-2">Verification Successful!</h2>
                <p className="text-white/80">Redirecting to login...</p>
              </motion.div>

              {/* Paper Plane Animation */}
              <motion.div
                className="absolute"
                initial={{ x: '-100vw', y: '0vh' }}
                animate={{ 
                  x: '100vw',
                  y: [0, -50, 50, 0],
                  transition: { 
                    duration: 2,
                    ease: "easeInOut",
                    y: {
                      duration: 2,
                      repeat: 0,
                      ease: "easeInOut"
                    }
                  }
                }}
              >
                {/* Trail Effect */}
                <motion.div
                  className="absolute right-full w-32 h-1 bg-gradient-to-r from-transparent to-white/50"
                  style={{ top: '50%' }}
                />
                
                {/* Paper Plane Icon */}
                <motion.div
                  className="text-white text-8xl transform"
                  animate={{
                    rotate: [0, -10, 20, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    ease: "linear",
                    times: [0, 0.25, 0.5, 0.75, 1]
                  }}
                >
                  <FiSend />
                </motion.div>

                {/* Particle Effects */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1.5],
                    y: [-20, 20],
                    x: [-20, 20]
                  }}
                  transition={{
                    duration: 1,
                    repeat: 2,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full max-w-md">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/30 rounded-full filter blur-xl opacity-70"></div>

          <motion.div
          className="bg-white/5 backdrop-blur-sm p-8 rounded-xl shadow-2xl relative z-10 border border-white/10 hover:bg-white/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300">
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
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white hover:bg-white/10 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                  <button
                    onClick={handleUpdateEmail}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
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

          <form onSubmit={handleVerify} className="space-y-6" style={{ opacity: verificationSuccess ? 0.5 : 1, pointerEvents: verificationSuccess ? 'none' : 'auto' }}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 text-center text-2xl tracking-widest hover:bg-white/10 transition-all duration-300"
                required
                disabled={loading || countdown === 0}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || countdown === 0}
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
                  <FiCheck className="mr-2" />
                )}
                {loading ? "Verifying..." : "Verify Email"}
              </span>
            </button>
          </form>

          {countdown === 0 ? (
            <button
              onClick={handleResendOTP}
              className="w-full mt-4 py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
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
    </div>
  );
};

export default VerifyEmail;