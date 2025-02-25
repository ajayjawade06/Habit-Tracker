import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { useAuth } from "../utils/AuthContext";
import { useNotification } from "../context/NotificationContext";

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
  const { showNotification } = useNotification();
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });
  const navigate = useNavigate();

  // Check password requirements in real-time
  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    });
  };

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
  };

  const isValidPassword = () => {
    return Object.values(passwordRequirements).every(req => req);
  };

  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      checkPasswordRequirements(value);
    }
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
    if (!isValidEmail(formData.email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    if (!isValidPassword(formData.password)) {
      showNotification("Please meet all password requirements", "error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification("Passwords do not match!", "error");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const result = await register(formDataToSend);
      
      if (result.success && result.requiresVerification) {
        showNotification(result.message || "Registration successful! Please verify your email.", "success");
        navigate('/verify-email', { 
          state: { 
            email: result.email,
            isNewRegistration: true,
            name: result.name
          }
        });
      } else {
        showNotification("Registration successful! Please log in.", "success");
        navigate('/login');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || "Registration failed";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-12 bg-black overflow-hidden">
      {/* Left side - Illustration */}
      <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 items-center justify-center relative h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full filter blur-xl animate-pulse delay-200"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 mx-auto text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M17 8l4 4m0 0l-4 4m4-4H3m18 4V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to Our Platform</h2>
          <p className="text-white/80 text-lg">Create an account to start your journey with us</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="md:col-span-7 flex items-center justify-center bg-black h-screen overflow-hidden">
        <div className="w-full max-w-md px-4">
          {/* Animated background elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full filter blur-xl opacity-70"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/30 rounded-full filter blur-xl opacity-70"></div>
          
          <div className="bg-white/5 backdrop-blur-sm p-2 rounded-xl shadow-2xl relative z-10 border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-0.5 text-center">Create Account</h2>
            <p className="text-xs text-white/80 text-center mb-2">Join us to get started</p>

            {/* Password Requirements Indicator */}
            {formData.password && (
              <div className="bg-white/5 backdrop-blur-sm p-1 rounded-xl border border-white/10 mb-1.5 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-white mb-0.5 text-[11px] font-medium">Password Requirements:</h3>
                <ul className="space-y-0.5 text-[11px]">
                  <li className={`flex items-center ${passwordRequirements.length ? 'text-green-400' : 'text-white/60'}`}>
                    <FiCheck className="mr-2" /> At least 8 characters
                  </li>
                  <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-400' : 'text-white/60'}`}>
                    <FiCheck className="mr-2" /> One uppercase letter
                  </li>
                  <li className={`flex items-center ${passwordRequirements.number ? 'text-green-400' : 'text-white/60'}`}>
                    <FiCheck className="mr-2" /> One number
                  </li>
                  <li className={`flex items-center ${passwordRequirements.special ? 'text-green-400' : 'text-white/60'}`}>
                    <FiCheck className="mr-2" /> One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-1.5">
              <div className="flex justify-center mb-1.5">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur"></div>
                  <div className="relative w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl border-2 border-white/20">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span role="img" aria-label="profile">💀</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white/5 backdrop-blur-sm rounded-full p-1.5 cursor-pointer border border-white/10 transition-all duration-300 hover:bg-white/20" title="Upload Profile Picture">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                      <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 text-sm hover:bg-white/10"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 text-sm hover:bg-white/10"
                  required
                  disabled={loading}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-9 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 text-sm hover:bg-white/10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-white/60 group-focus-within:text-white transition-colors duration-300" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-9 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 transition-all duration-300 text-sm hover:bg-white/10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors duration-300"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:shadow-lg hover:shadow-purple-500/30"
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

            <p className="mt-4 text-center text-white/80 text-sm">
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
    </div>
  );
};

export default Register;