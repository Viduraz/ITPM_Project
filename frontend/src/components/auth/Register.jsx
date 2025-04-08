// src/components/auth/Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Validate fields when they change
  useEffect(() => {
    validateField('firstName', formData.firstName);
    validateField('lastName', formData.lastName);
    validateField('email', formData.email);
    checkPasswordStrength(formData.password);
    validateField('password', formData.password);
    validateField('confirmPassword', formData.confirmPassword);
    validateField('contactNumber', formData.contactNumber);
    validateField('IdNumber', formData.IdNumber);
  }, [formData]);

  const validateField = (fieldName, value) => {
    let isValid = false;
    let message = '';

    switch (fieldName) {
      case 'firstName':
        isValid = value.trim().length >= 2;
        message = isValid ? '' : 'First name must be at least 2 characters';
        break;
        
      case 'lastName':
        isValid = value.trim().length >= 2;
        message = isValid ? '' : 'Last name must be at least 2 characters';
        break;
        
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        isValid = emailRegex.test(value);
        message = isValid ? '' : 'Please enter a valid email address';
        break;
        
      case 'password':
        isValid = passwordStrength.score >= 3;
        message = isValid ? '' : 'Password is not strong enough';
        break;
        
      case 'confirmPassword':
        isValid = value === formData.password && value !== '';
        message = isValid ? '' : 'Passwords do not match';
        break;
        
      case 'contactNumber':
        // Only allow exactly 10 digits
        const phoneRegex = /^\d{10}$/;
        isValid = phoneRegex.test(value);
        message = isValid ? '' : 'Please enter exactly 10 digits for phone number';
        break;
        
      case 'IdNumber':
        // Only allow exactly 12 digits
        const idRegex = /^\d{12}$/;
        isValid = idRegex.test(value);
        message = isValid ? '' : 'Please enter exactly 12 digits for ID number';
        break;
        
      default:
        break;
    }

    setValidations(prev => ({
      ...prev,
      [fieldName]: { valid: isValid, message }
    }));

    return isValid;
  };

  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate score (0-5) based on criteria met
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    
    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
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

  // Modified renderField function
  const renderField = (id, label, type, required = true) => {
    const validation = validations[id];
    
    // Extra props for specific fields
    const extraProps = {};
    
    if (id === 'contactNumber') {
      extraProps.maxLength = 10;
      extraProps.pattern = '[0-9]*'; // Only allow digits
      extraProps.inputMode = 'numeric'; // Show numeric keyboard on mobile
      extraProps.placeholder = '0771234567';
    }
    
    if (id === 'IdNumber') {
      extraProps.maxLength = 12;
      extraProps.pattern = '[0-9]*'; // Only allow digits
      extraProps.inputMode = 'numeric'; // Show numeric keyboard on mobile
      extraProps.placeholder = '199912345678';
    }
    
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 relative">
          <input
            id={id}
            name={id}
            type={type}
            required={required}
            className={`block w-full px-3 py-2 border ${
              validation.message ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            value={formData[id]}
            onChange={handleChange}
            {...extraProps}
          />
          {validation.valid && (
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        {validation.message && (
          <p className="mt-1 text-sm text-red-600">{validation.message}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {step} of 2
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              {renderField('firstName', 'First Name', 'text')}
              {renderField('lastName', 'Last Name', 'text')}
              {renderField('email', 'Email address', 'email')}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`block w-full px-3 py-2 border ${
                      validations.password.message ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {validations.password.valid && (
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                
                {/* Password strength meter */}
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getPasswordStrengthLabel().color}`} 
                      style={{ width: `${passwordStrength.score * 20}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Strength: {getPasswordStrengthLabel().label}
                  </p>
                  
                  {/* Password requirements */}
                  <ul className="mt-1 text-xs text-gray-600 space-y-1">
                    <li className={`flex items-center ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordStrength.hasMinLength ? '✓' : '○'}</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasUppercase ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordStrength.hasUppercase ? '✓' : '○'}</span>
                      At least one uppercase letter
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasLowercase ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordStrength.hasLowercase ? '✓' : '○'}</span>
                      At least one lowercase letter
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordStrength.hasNumber ? '✓' : '○'}</span>
                      At least one number
                    </li>
                    <li className={`flex items-center ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-gray-500'}`}>
                      <span className="mr-1">{passwordStrength.hasSpecialChar ? '✓' : '○'}</span>
                      At least one special character
                    </li>
                  </ul>
                </div>
                                
                {validations.password.message && (
                  <p className="mt-1 text-sm text-red-600">{validations.password.message}</p>
                )}
              </div>
              
              {renderField('confirmPassword', 'Confirm Password', 'password')}

              <div className="flex justify-end">
                <button
                  type="button"
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    validateStep1() 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-indigo-300 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={nextStep}
                  disabled={!validateStep1()}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {renderField('contactNumber', 'Contact Number', 'tel')}
              {renderField('IdNumber', 'ID Number', 'text')}
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="laboratory">Laboratory</option>
                  <option value="dataentry">Data Entry</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && (
                <div className="p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                  <p>{error}</p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={prevStep}
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading || !validateStep2()}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    validateStep2() && !isLoading
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-indigo-300 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </div>
          )}
        </form>
        
        <div className="text-sm text-center">
          <span>Already have an account? </span>
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;