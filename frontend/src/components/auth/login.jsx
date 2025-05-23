// src/components/auth/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaHospital,
  FaUserMd,
  FaSignInAlt,
  FaFlask,
  FaHeartbeat,
  FaNotesMedical,
} from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Features for the carousel
  const features = [
    {
      icon: <FaNotesMedical className="text-2xl" />,
      title: "Complete Medical Records",
      description: "Access your entire medical history in one secure location",
    },
    {
      icon: <FaHeartbeat className="text-2xl" />,
      title: "Real-time Health Monitoring",
      description: "Track your vitals and health metrics over time",
    },
    {
      icon: <FaFlask className="text-2xl" />,
      title: "Lab Results Integration",
      description: "Get instant updates when new lab results are available",
    },
  ];

  // Change feature every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    // Add a class to the body for full-page styling
    document.body.classList.add("login-page");

    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      // Store user details in localStorage
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", `${user.firstName} ${user.lastName}`);
      localStorage.setItem("userRole", user.role);

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (user.role === "patient") {
        navigate("/patient/dashboard");
      } else if (user.role === "pharmacy") {
        navigate("/pharmacy/dashboard");
      } else if (user.role === "laboratory") {
        navigate("/laboratory/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-cyan-300 to-blue-300 blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "15%" }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-emerald-300 to-teal-300 blur-3xl opacity-20"
          animate={{
            x: [0, -70, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{ top: "40%", right: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 blur-3xl opacity-20"
          animate={{
            x: [0, 120, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ bottom: "5%", left: "25%" }}
        />
      </div>

      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12">
        <div className="max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-white/30 rounded-3xl p-10 border border-white/30 shadow-xl"
          >
            <div className="mb-10 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 blur-sm opacity-75"></div>
                <div className="relative bg-white rounded-full p-3">
                  <FaHospital className="text-4xl text-cyan-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold ml-4 bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent">
                MedHistory System
              </h1>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Welcome Back!
            </h2>

            <p className="text-xl mb-10 leading-relaxed text-gray-700">
              Your comprehensive healthcare management solution in one secure
              platform.
            </p>

            <div className="h-56 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-700 p-6 rounded-xl text-white shadow-lg transform hover:scale-[1.02] transition-transform"
                >
                  <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    {features[activeIndex].icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2">
                    {features[activeIndex].title}
                  </h3>
                  <p className="text-cyan-100">
                    {features[activeIndex].description}
                  </p>
                  <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2">
                    {features.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`w-2 h-2 rounded-full ${
                          activeIndex === idx ? "bg-white" : "bg-white/40"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-white/50 backdrop-blur-sm p-4 shadow-sm">
                <h4 className="font-bold text-3xl text-cyan-700 mb-1">10k+</h4>
                <p className="text-gray-600 text-sm">Users</p>
              </div>
              <div className="rounded-xl bg-white/50 backdrop-blur-sm p-4 shadow-sm">
                <h4 className="font-bold text-3xl text-cyan-700 mb-1">500+</h4>
                <p className="text-gray-600 text-sm">Doctors</p>
              </div>
              <div className="rounded-xl bg-white/50 backdrop-blur-sm p-4 shadow-sm">
                <h4 className="font-bold text-3xl text-cyan-700 mb-1">98%</h4>
                <p className="text-gray-600 text-sm">Satisfaction</p>
              </div>
            </div>

            {/* Added testimonial section */}
            <div className="mt-10 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-sm">
                    "The MedHistory platform has transformed how I manage my
                    healthcare. Having all my records in one place has been
                    incredible."
                  </p>
                  <p className="mt-2 font-medium text-gray-800">
                    John Doe, Patient
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="max-w-md w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="backdrop-blur-sm bg-white/80 rounded-3xl p-10 shadow-xl border border-white/50">
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent mb-2">
                Sign In
              </h2>
              <p className="text-gray-600">Access your healthcare dashboard</p>
            </motion.div>

            <motion.form
              className="space-y-6"
              onSubmit={handleSubmit}
              variants={containerVariants}
            >
              <motion.div
                variants={itemVariants}
                className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
              >
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative rounded-xl overflow-hidden shadow-sm group">
                  <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <FaEnvelope className="text-white" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-16 appearance-none block w-full px-3 py-3.5 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-cyan-600 hover:text-cyan-500 transition-all hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-sm group">
                  <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <FaLock className="text-white" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="pl-16 appearance-none block w-full px-3 py-3.5 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 px-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  className="rounded-xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="mt-8">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full flex justify-center py-3.5 px-4 border-0 text-sm font-medium rounded-xl text-white overflow-hidden shadow-lg"
                  style={{
                    background: "linear-gradient(to right, #0891b2, #2563eb)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  <motion.span
                    className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      repeatDelay: 1.5,
                    }}
                  />
                  <span className="relative flex items-center z-10">
                    <FaSignInAlt className="mr-2" />
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-center border-t border-gray-200 pt-6"
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all"
                >
                  Register here
                </Link>
              </p>

              {/* Doctor redirect button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <Link
                  to="/doctor/login"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <FaUserMd className="mr-2" />
                  <span>Doctor Login Portal</span>
                </Link>
                <p className="text-xs text-gray-500 mt-2">
                  For healthcare providers only
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-center text-xs text-gray-500"
            >
              <div className="flex items-center justify-center space-x-4">
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Terms
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Privacy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Help
                </a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
