// src/components/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../pages/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, 
  FaUserMd, FaHospital, FaArrowRight, FaArrowLeft, 
  FaUserPlus, FaHeartbeat, FaUserCheck, FaFlask, FaClinicMedical
} from 'react-icons/fa';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    IdNumber: '',
    role: 'patient', // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const pageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const validateStep1 = () => {
    return (
      formData.firstName && 
      formData.lastName && 
      formData.email && 
      formData.password && 
      formData.password === formData.confirmPassword
    );
  };

  const validateStep2 = () => {
    return formData.contactNumber && formData.IdNumber && formData.role;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...userData } = formData;
      const user = await register(userData);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (user.role === 'pharmacy') {
        navigate('/pharmacy/dashboard');
      } else if (user.role === 'laboratory') {
        navigate('/laboratory/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'patient':
        return <FaHeartbeat className="text-pink-500" />;
      case 'doctor':
        return <FaUserMd className="text-blue-500" />;
      default:
        return <FaUser className="text-indigo-500" />;
    }
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
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '15%' }}
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
            delay: 1
          }}
          style={{ top: '40%', right: '10%' }}
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
            delay: 2
          }}
          style={{ bottom: '5%', left: '25%' }}
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
            
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Our Healthcare Platform</h2>
            
            <p className="text-xl mb-10 leading-relaxed text-gray-700">
              Create an account to access comprehensive healthcare services and manage your medical information securely.
            </p>

            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 p-6 rounded-xl text-white shadow-lg">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="font-bold text-xl">Registration Benefits</h3>
                <FaUserPlus className="text-2xl" />
              </div>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1.5 mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Complete access to your medical history</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1.5 mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Book appointments with healthcare providers</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1.5 mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Secure sharing of health records with providers</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1.5 mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Track medications and set reminders</span>
                </li>
              </ul>
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
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-sm">"The MedHistory platform has transformed how I manage my healthcare. Having all my records in one place has been incredible."</p>
                  <p className="mt-2 font-medium text-gray-800">John Doe, Patient</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side with registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="max-w-md w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="backdrop-blur-sm bg-white/80 rounded-3xl p-8 sm:p-10 shadow-xl border border-white/50"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-transparent mb-2">Create Account</h2>
              <div className="flex items-center justify-center space-x-1">
                {[1, 2].map((i) => (
                  <div 
                    key={i}
                    onClick={() => i < step && setStep(i)}
                    className={`flex items-center ${i < step ? 'cursor-pointer' : ''}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      step === i 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                        : i < step 
                          ? 'bg-green-100 text-green-500' 
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {i < step ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i
                      )}
                    </div>
                    {i < 2 && (
                      <div className={`w-12 h-1 ${
                        step > i ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-gray-600">
                <span className="font-medium">Step {step}:</span> {step === 1 ? 'Basic Information' : 'Additional Details'}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait" custom={step}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        variants={itemVariants} 
                        className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                      >
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <div className="relative rounded-xl overflow-hidden shadow-sm group">
                          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="pl-16 appearance-none block w-full px-3 py-3 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                        </div>
                      </motion.div>

                      <motion.div 
                        variants={itemVariants} 
                        className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                      >
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <div className="relative rounded-xl overflow-hidden shadow-sm group">
                          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className="pl-16 appearance-none block w-full px-3 py-3 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div 
                      variants={itemVariants} 
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
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
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <FaLock className="text-white" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
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
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <FaLock className="text-white" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 px-3 flex items-center">
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                          >
                            {showConfirmPassword ? (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                          </svg>
                          <span>Passwords don't match</span>
                        </div>
                      )}
                    </motion.div>

                    {/* Password strength indicator */}
                    {formData.password && (
                      <motion.div 
                        variants={itemVariants}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <p className="text-xs text-gray-600 mb-2">Password strength:</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              formData.password.length < 6
                                ? 'bg-red-500 w-1/4'
                                : formData.password.length < 8
                                  ? 'bg-yellow-500 w-2/4'
                                  : /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)
                                    ? 'bg-green-500 w-full'
                                    : 'bg-blue-500 w-3/4'
                            }`}
                          ></div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <div className={`text-xs px-2 py-1 rounded ${formData.password.length >= 8 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            8+ characters
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${/[A-Z]/.test(formData.password) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            Uppercase
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${/[0-9]/.test(formData.password) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            Number
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep1()}
                        className={`relative w-full flex justify-center py-3.5 px-4 border-0 text-sm font-medium rounded-xl text-white overflow-hidden shadow-lg ${
                          validateStep1() ? 'opacity-100' : 'opacity-60 cursor-not-allowed'
                        }`}
                        style={{ background: validateStep1() ? "linear-gradient(to right, #0891b2, #2563eb)" : "linear-gradient(to right, #9ca3af, #6b7280)" }}
                        whileHover={validateStep1() ? { 
                          scale: 1.02,
                          boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)"
                        } : {}}
                        whileTap={validateStep1() ? { scale: 0.98 } : {}}
                      >
                        <span className="relative flex items-center z-10">
                          <span className="mr-2">Continue</span>
                          <FaArrowRight />
                        </span>
                        <motion.span 
                          className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white"
                          animate={{ 
                            x: ['-100%', '100%'],
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            repeatDelay: 1.5 
                          }}
                        />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={2}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-4"
                  >
                    <motion.div 
                      variants={itemVariants} 
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <FaPhone className="text-white" />
                        </div>
                        <input
                          id="contactNumber"
                          name="contactNumber"
                          type="text"
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
                          placeholder="+1 (555) 123-4567"
                          value={formData.contactNumber}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants} 
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="IdNumber" className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <FaIdCard className="text-white" />
                        </div>
                        <input
                          id="IdNumber"
                          name="IdNumber"
                          type="text"
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-150 ease-in-out text-sm"
                          placeholder="ID number or passport"
                          value={formData.IdNumber}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div 
                          className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.role === 'patient' 
                              ? 'ring-2 ring-cyan-500 ring-offset-1' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setFormData({...formData, role: 'patient'})}
                        >
                          <div className={`absolute inset-0 ${
                            formData.role === 'patient' 
                              ? 'bg-gradient-to-br from-cyan-100 to-blue-50' 
                              : 'bg-white'
                          }`}></div>
                          <div className="relative p-4 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                              formData.role === 'patient' 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <FaHeartbeat className="text-lg" />
                            </div>
                            <span className={`font-medium ${
                              formData.role === 'patient' 
                                ? 'text-cyan-700' 
                                : 'text-gray-700'
                            }`}>Patient</span>
                            {formData.role === 'patient' && (
                              <svg className="absolute top-2 right-2 w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div 
                          className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.role === 'doctor' 
                              ? 'ring-2 ring-cyan-500 ring-offset-1' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setFormData({...formData, role: 'doctor'})}
                        >
                          <div className={`absolute inset-0 ${
                            formData.role === 'doctor' 
                              ? 'bg-gradient-to-br from-cyan-100 to-blue-50' 
                              : 'bg-white'
                          }`}></div>
                          <div className="relative p-4 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                              formData.role === 'doctor' 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <FaUserMd className="text-lg" />
                            </div>
                            <span className={`font-medium ${
                              formData.role === 'doctor' 
                                ? 'text-cyan-700' 
                                : 'text-gray-700'
                            }`}>Doctor</span>
                            {formData.role === 'doctor' && (
                              <svg className="absolute top-2 right-2 w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div 
                          className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.role === 'laboratory' 
                              ? 'ring-2 ring-cyan-500 ring-offset-1' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setFormData({...formData, role: 'laboratory'})}
                        >
                          <div className={`absolute inset-0 ${
                            formData.role === 'laboratory' 
                              ? 'bg-gradient-to-br from-cyan-100 to-blue-50' 
                              : 'bg-white'
                          }`}></div>
                          <div className="relative p-4 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                              formData.role === 'laboratory' 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <FaFlask className="text-lg" />
                            </div>
                            <span className={`font-medium ${
                              formData.role === 'laboratory' 
                                ? 'text-cyan-700' 
                                : 'text-gray-700'
                            }`}>Lab</span>
                            {formData.role === 'laboratory' && (
                              <svg className="absolute top-2 right-2 w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div 
                          className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.role === 'pharmacy' 
                              ? 'ring-2 ring-cyan-500 ring-offset-1' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setFormData({...formData, role: 'pharmacy'})}
                        >
                          <div className={`absolute inset-0 ${
                            formData.role === 'pharmacy' 
                              ? 'bg-gradient-to-br from-cyan-100 to-blue-50' 
                              : 'bg-white'
                          }`}></div>
                          <div className="relative p-4 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                              formData.role === 'pharmacy' 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <FaClinicMedical className="text-lg" />
                            </div>
                            <span className={`font-medium ${
                              formData.role === 'pharmacy' 
                                ? 'text-cyan-700' 
                                : 'text-gray-700'
                            }`}>Pharmacy</span>
                            {formData.role === 'pharmacy' && (
                              <svg className="absolute top-2 right-2 w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div 
                          className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                            formData.role === 'admin' 
                              ? 'ring-2 ring-cyan-500 ring-offset-1' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setFormData({...formData, role: 'admin'})}
                        >
                          <div className={`absolute inset-0 ${
                            formData.role === 'admin' 
                              ? 'bg-gradient-to-br from-cyan-100 to-blue-50' 
                              : 'bg-white'
                          }`}></div>
                          <div className="relative p-4 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                              formData.role === 'admin' 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <FaUserCheck className="text-lg" />
                            </div>
                            <span className={`font-medium ${
                              formData.role === 'admin' 
                                ? 'text-cyan-700' 
                                : 'text-gray-700'
                            }`}>Admin</span>
                            {formData.role === 'admin' && (
                              <svg className="absolute top-2 right-2 w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <input 
                          type="hidden" 
                          name="role" 
                          value={formData.role} 
                          onChange={handleChange} 
                        />
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
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">{error}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="flex justify-between pt-4">
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        className="relative flex justify-center py-3 px-6 border-0 text-sm font-medium rounded-xl text-gray-700 overflow-hidden shadow-md bg-white"
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 5px 15px -3px rgba(0, 0, 0, 0.1)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative flex items-center z-10">
                          <FaArrowLeft className="mr-2" />
                          <span>Back</span>
                        </span>
                      </motion.button>
                      
                      <motion.button
                        type="submit"
                        disabled={isLoading || !validateStep2()}
                        className={`relative flex justify-center py-3 px-6 border-0 text-sm font-medium rounded-xl text-white overflow-hidden shadow-lg ${
                          validateStep2() && !isLoading ? 'opacity-100' : 'opacity-60 cursor-not-allowed'
                        }`}
                        style={{ background: validateStep2() && !isLoading ? "linear-gradient(to right, #0891b2, #2563eb)" : "linear-gradient(to right, #9ca3af, #6b7280)" }}
                        whileHover={validateStep2() && !isLoading ? { 
                          scale: 1.02,
                          boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.5)"
                        } : {}}
                        whileTap={validateStep2() && !isLoading ? { scale: 0.98 } : {}}
                      >
                        <span className="relative flex items-center z-10">
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating...
                            </>
                          ) : (
                            <>
                              <FaUserCheck className="mr-2" />
                              Create Account
                            </>
                          )}
                        </span>
                        <motion.span 
                          className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-20 bg-white"
                          animate={{ 
                            x: ['-100%', '100%'],
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            repeatDelay: 1.5 
                          }}
                        />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <motion.div 
              variants={itemVariants} 
              className="mt-8 text-center border-t border-gray-200 pt-6"
            >
              <p className="text-gray-600">Already have an account? {" "}
                <Link to="/login" className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all">
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;