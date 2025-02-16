import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../utils/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
  };

  const isValidPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError("Password must be at least 8 characters long, with one uppercase letter, one number, and one special character.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const result = await register(formDataToSend);
      setSuccess(result.message);
      // Add a delay to show the success message before redirecting
      setTimeout(() => {
        navigate(result.redirectTo);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-3 sm:p-4">
      <div className="relative w-full max-w-sm sm:max-w-md">
        {/* Animated background elements */}
        <div className="absolute -top-16 sm:-top-20 -left-16 sm:-left-20 w-32 sm:w-40 h-32 sm:h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-16 sm:-bottom-20 -right-16 sm:-right-20 w-32 sm:w-40 h-32 sm:h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-16 sm:-bottom-20 -left-16 sm:-left-20 w-32 sm:w-40 h-32 sm:h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl relative z-10 border border-white/20 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center">Create Account</h2>
          <p className="text-sm sm:text-base text-white/80 text-center mb-6 sm:mb-8">Join us to get started</p>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30 text-white mb-6 animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 backdrop-blur-sm p-4 rounded-xl border border-green-500/30 text-white mb-6 animate-fade-in">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                <img
                  src={previewUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="relative w-24 sm:w-32 h-24 sm:h-32 rounded-full object-cover border-2 border-white/20"
                />
                <label className="absolute bottom-0 right-0 bg-white/10 backdrop-blur-sm rounded-full p-2 cursor-pointer border border-white/20 transition-all duration-300 hover:bg-white/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                    <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiUser className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base"
                required
                disabled={loading}
              />
            </div>


            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-300"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiLock className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 transition-all duration-300 text-sm sm:text-base"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors duration-300"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
                ) : null}
                {loading ? "Creating Account..." : "Create Account"}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-white/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-white hover:underline transition-all duration-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;