// src/components/auth/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../pages/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, 
  FaUserMd, FaHospital, FaArrowRight, FaArrowLeft, 
  FaUserPlus, FaHeartbeat, FaUserCheck
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
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 blur-3xl opacity-30"
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
          className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 blur-3xl opacity-20"
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
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 blur-3xl opacity-20"
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
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-sm opacity-75"></div>
                <div className="relative bg-white rounded-full p-3">
                  <FaHospital className="text-4xl text-indigo-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold ml-4 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                MedHistory System
              </h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Our Healthcare Platform</h2>
            
            <p className="text-xl mb-10 leading-relaxed text-gray-700">
              Create an account to access comprehensive healthcare services and manage your medical information securely.
            </p>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl text-white shadow-lg">
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
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">Create Account</h2>
              <div className="flex items-center justify-center">
                <div className={`h-1 w-10 mx-1 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <div className={`h-1 w-10 mx-1 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              </div>
              <p className="mt-2 text-gray-600">Step {step} of 2: {step === 1 ? 'Basic Information' : 'Additional Details'}</p>
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
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        variants={itemVariants} 
                        className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                      >
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <div className="relative rounded-xl overflow-hidden shadow-sm group">
                          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="pl-16 appearance-none block w-full px-3 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300"></div>
                        </div>
                      </motion.div>

                      <motion.div 
                        variants={itemVariants} 
                        className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                      >
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <div className="relative rounded-xl overflow-hidden shadow-sm group">
                          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <FaUser className="text-white" />
                          </div>
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className="pl-16 appearance-none block w-full px-3 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300"></div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div 
                      variants={itemVariants} 
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <FaEnvelope className="text-white" />
                        </div>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
                          placeholder="johndoe@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <FaLock className="text-white" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
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
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants}
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <FaLock className="text-white" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
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
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">Passwords don't match</p>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        disabled={!validateStep1()}
                        className={`relative w-full flex justify-center py-3 px-4 border-0 text-sm font-medium rounded-xl text-white overflow-hidden shadow-lg ${
                          validateStep1() ? 'opacity-100' : 'opacity-60 cursor-not-allowed'
                        }`}
                        style={{ background: validateStep1() ? "linear-gradient(to right, #6366f1, #8b5cf6, #d946ef)" : "linear-gradient(to right, #9ca3af, #6b7280)" }}
                        whileHover={validateStep1() ? { 
                          scale: 1.02,
                          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)"
                        } : {}}
                        whileTap={validateStep1() ? { scale: 0.98 } : {}}
                      >
                        <span className="relative flex items-center z-10">
                          <span className="mr-2">Continue</span>
                          <FaArrowRight />
                        </span>
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
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <FaPhone className="text-white" />
                        </div>
                        <input
                          id="contactNumber"
                          name="contactNumber"
                          type="text"
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
                          placeholder="+1 (555) 123-4567"
                          value={formData.contactNumber}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                    </motion.div>

                    <motion.div 
                      variants={itemVariants} 
                      className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
                    >
                      <label htmlFor="IdNumber" className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                      <div className="relative rounded-xl overflow-hidden shadow-sm group">
                        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <FaIdCard className="text-white" />
                        </div>
                        <input
                          id="IdNumber"
                          name="IdNumber"
                          type="text"
                          required
                          className="pl-16 appearance-none block w-full px-3 py-3 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
                          placeholder="ID number or passport"
                          value={formData.IdNumber}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:w-2 transition-all duration-300"></div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="transform transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Select Your Role</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div 
                          className={`relative rounded-xl p-4 border-2 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
                            formData.role === 'patient' 
                              ? 'border-indigo-500 bg-indigo-50' 
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                          onClick={() => setFormData({...formData, role: 'patient'})}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            formData.role === 'patient' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            <FaHeartbeat />
                          </div>
                          <span className={`font-medium ${
                            formData.role === 'patient' 
                              ? 'text-indigo-700' 
                              : 'text-gray-500'
                          }`}>Patient</span>
                          {formData.role === 'patient' && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div 
                          className={`relative rounded-xl p-4 border-2 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
                            formData.role === 'doctor' 
                              ? 'border-indigo-500 bg-indigo-50' 
                              : 'border-gray-200 hover:border-indigo-300'
                          }`}
                          onClick={() => setFormData({...formData, role: 'doctor'})}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            formData.role === 'doctor' 
                              ? 'bg-indigo-100 text-indigo-700' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            <FaUserMd />
                          </div>
                          <span className={`font-medium ${
                            formData.role === 'doctor' 
                              ? 'text-indigo-700' 
                              : 'text-gray-500'
                          }`}>Doctor</span>
                          {formData.role === 'doctor' && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
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
                        className="relative flex justify-center py-3 px-6 border-0 text-sm font-medium rounded-xl text-gray-700 overflow-hidden shadow-md bg-white/90"
                        whileHover={{ scale: 1.02 }}
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
                        style={{ background: validateStep2() && !isLoading ? "linear-gradient(to right, #6366f1, #8b5cf6, #d946ef)" : "linear-gradient(to right, #9ca3af, #6b7280)" }}
                        whileHover={validateStep2() && !isLoading ? { 
                          scale: 1.02,
                          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)"
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
                <Link to="/login" className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all">
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