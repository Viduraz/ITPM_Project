import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../pages/context/AuthContext';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    profilePhoto: null,
    specialty: '',
    role: '',
    education: '',
    boardCertifications: '',
    doctorId: '',
    idVersion: 'old', // 'old' or 'new'
    locations: '',
    consultationStartTime: '09:00',
    consultationEndTime: '17:00',
    experience: 0,
    licenseNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [doctorProfile, setDoctorProfile] = useState(null);

  // Base API URL - make sure this matches your backend setup
  const API_BASE_URL = 'http://localhost:3000/api';

  // Replace toast.error and toast.success with setNotification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Initialize default form data from user if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.firstName && user.lastName ? `Dr. ${user.firstName} ${user.lastName}` : prev.fullName,
        doctorId: user.IdNumber || ''
      }));
    }
  }, [user]);

  // Fetch doctor profile data
  const fetchDoctorProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        showNotification('Authentication token not found. Please log in again.', 'error');
        setIsLoading(false);
        return;
      }

      // Log which endpoint we're calling for debugging
      console.log('Fetching doctor profile from:', `${API_BASE_URL}/doctor/profile`);
      
      const response = await axios.get(`${API_BASE_URL}/doctor/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Doctor profile response:', response.data);
      
      if (response.data && response.data.doctor) {
        const doctorData = response.data.doctor;
        setDoctorProfile(doctorData);
        const userData = doctorData.userId;
        
        // Map backend data to form data
        setFormData({
          fullName: `Dr. ${userData.firstName} ${userData.lastName}`,
          profilePhoto: userData.profileImage || null,
          specialty: doctorData.specialization || '',
          role: doctorData.qualifications && doctorData.qualifications.length > 0 
            ? doctorData.qualifications[0].degree || '' : '',
          education: doctorData.qualifications && doctorData.qualifications.length > 0 
            ? doctorData.qualifications[0].institution || '' : '',
          boardCertifications: '',
          doctorId: userData.IdNumber || '',
          idVersion: userData.IdNumber && userData.IdNumber.length === 10 ? 'old' : 'new',
          locations: doctorData.hospitalAffiliations ? 
            doctorData.hospitalAffiliations.map(ha => ha.hospital.name).join('\n') : '',
          consultationStartTime: doctorData.consultationHours?.start || '09:00',
          consultationEndTime: doctorData.consultationHours?.end || '17:00',
          experience: doctorData.experience || 0,
          licenseNumber: doctorData.licenseNumber || ''
        });
        
        // Set selected hospitals
        if (doctorData.hospitalAffiliations && doctorData.hospitalAffiliations.length > 0) {
          setSelectedHospitals(doctorData.hospitalAffiliations.map(ha => ha.hospital._id));
        }
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      
      // Create a more detailed error message
      let errorMessage = 'Failed to load profile data';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage += `: ${error.response.status} ${error.response.statusText}`;
        
        // If we got a 404, this might be a first-time setup
        if (error.response.status === 404) {
          console.log('Doctor profile not found. This might be a first-time setup.');
          // Just set loading to false and let the user fill out the form
          setIsLoading(false);
          return;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage += ': No response from server. Please check if the backend is running.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += `: ${error.message}`;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch hospitals for dropdown
  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found for hospital fetch');
        return;
      }
      
      console.log('Fetching hospitals from:', `${API_BASE_URL}/doctor/hospitals`);
      
      const response = await axios.get(`${API_BASE_URL}/doctor/hospitals`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Hospitals response:', response.data);
      
      if (response.data && response.data.hospitals) {
        setHospitals(response.data.hospitals);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      // Don't show a notification for this, as it's not critical
    }
  };

  useEffect(() => {
    // Fetch data when component mounts
    fetchDoctorProfile();
    fetchHospitals();
  }, []);

  const specialties = [
    { value: '', label: 'Select Specialty' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'surgery', label: 'Surgery' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation (letters and spaces only)
    if (!/^[A-Za-z\s.]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Name can only contain letters, spaces and dots';
    }

    // ID validation based on version
    if (formData.idVersion === 'old') {
      if (!/^\d{9}[vV]$/.test(formData.doctorId)) {
        newErrors.doctorId = 'Old NIC must have exactly 9 numbers followed by V';
      }
    } else {
      if (!/^\d{12}$/.test(formData.doctorId)) {
        newErrors.doctorId = 'New NIC must have 12 numbers';
      }
    }

    // License number validation
    if (!formData.licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
    }

    // Specialty validation
    if (!formData.specialty) {
      newErrors.specialty = 'Please select a specialty';
    }

    // Role validation (letters and spaces only)
    if (!/^[A-Za-z\s]+$/.test(formData.role)) {
      newErrors.role = 'Role can only contain letters and spaces';
    }

    // Time validation
    if (formData.consultationStartTime >= formData.consultationEndTime) {
      newErrors.consultationTime = 'End time must be after start time';
    }

    // Hospital validation
    if (selectedHospitals.length === 0) {
      newErrors.hospitals = 'Please select at least one hospital';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'fullName' || name === 'role') {
      // Allow only letters and spaces
      const sanitizedValue = value.replace(/[^A-Za-z\s.]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === 'doctorId') {
      if (formData.idVersion === 'old') {
        // For old NIC: allow only numbers and 'v', limit to 10 characters
        let sanitizedValue = value.replace(/[^0-9vV]/g, '');
        // Ensure only one 'v' at the end
        const numbers = sanitizedValue.replace(/[vV]/g, '').slice(0, 9);
        const hasV = sanitizedValue.toLowerCase().includes('v');
        sanitizedValue = numbers + (hasV ? 'v' : '');
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      } else {
        // For new NIC: allow only numbers, limit to 12 digits
        const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 12);
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      }
    } else if (name === 'experience') {
      // Make sure experience is a number
      const numValue = parseInt(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle hospital selection
  const handleHospitalSelect = (hospitalId) => {
    setSelectedHospitals(prev => {
      if (prev.includes(hospitalId)) {
        return prev.filter(id => id !== hospitalId);
      } else {
        return [...prev, hospitalId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          showNotification('Authentication token not found. Please log in again.', 'error');
          setIsLoading(false);
          return;
        }
        
        // Extract first and last name from fullName
        const nameParts = formData.fullName.split(' ');
        let firstName = '';
        let lastName = '';
        
        // Handle different formats (with 'Dr.' prefix or without)
        if (nameParts[0].toLowerCase() === 'dr.') {
          firstName = nameParts[1] || '';
          lastName = nameParts.slice(2).join(' ');
        } else {
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ');
        }
        
        // Prepare user data for update
        const userData = {
          firstName,
          lastName,
          IdNumber: formData.doctorId
        };
        
        // Prepare hospital affiliations
        const hospitalAffiliations = selectedHospitals.map(hospitalId => ({
          hospital: hospitalId,
          isAvailableToday: false // default value
        }));
        
        // Prepare doctor data for update
        const doctorData = {
          specialization: formData.specialty,
          experience: formData.experience,
          hospitalAffiliations,
          licenseNumber: formData.licenseNumber,
          qualifications: [{
            degree: formData.role,
            institution: formData.education,
            year: new Date().getFullYear()
          }],
          consultationHours: {
            start: formData.consultationStartTime,
            end: formData.consultationEndTime
          }
        };
        
        console.log('Updating user profile with:', userData);
        
        // Update user profile
        await axios.put(`${API_BASE_URL}/auth/update-profile`, userData, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          }
        });
        
        console.log('Updating doctor profile with:', doctorData);
        
        // Update doctor profile
        await axios.put(`${API_BASE_URL}/doctor/profile`, doctorData, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          }
        });
        
        showNotification('Profile updated successfully');
        
        // Refresh doctor profile data
        fetchDoctorProfile();
      } catch (error) {
        console.error('Error updating profile:', error);
        
        // Create a more detailed error message
        let errorMessage = 'Failed to update profile';
        if (error.response) {
          errorMessage += `: ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          errorMessage += ': No response from server. Please check if the backend is running.';
        } else {
          errorMessage += `: ${error.message}`;
        }
        
        showNotification(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 w-full text-gray-800">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white z-50`}>
          {notification.message}
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 transform hover:scale-105 transition-transform duration-300 hover:text-indigo-600 cursor-default">
          Doctor Profile Setup
        </h1>
        <p className="text-gray-600">Complete your professional profile to get started</p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-2xl transition-shadow duration-300">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <section className="p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
              <span className="mr-2">📋</span> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name and Title 
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Dr. John Smith, MD"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo 
                </label>
                <input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  className="w-full border border-blue-900 p-2 rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section className="p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-purple-800 flex items-center">
              <span className="mr-2"></span> Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Version selector */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Version
                  </label>
                  <select
                    name="idVersion"
                    value={formData.idVersion}
                    onChange={handleChange}
                    className="w-full border border-blue-900 p-3 rounded-md"
                  >
                    <option value="old">Old NIC</option>
                    <option value="new">New NIC</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
                    NIC Number * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="doctorId"
                    name="doctorId"
                    placeholder={formData.idVersion === 'old' ? "e.g. 123456789v" : "e.g. 123456789012"}
                    className="w-full border border-blue-900 p-3 rounded-md"
                    required
                    value={formData.doctorId}
                    onChange={handleChange}
                  />
                  {errors?.doctorId && <p className="text-red-500 text-sm mt-1">{errors.doctorId}</p>}
                </div>
              </div>

              {/* License number field */}
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  placeholder="e.g. MD12345"
                  className="w-full border border-blue-900 p-3 rounded-md"
                  required
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
                {errors?.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
              </div>

              {/* Specialty field */}
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty / Department 
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  className="w-full border border-blue-900 p-3 rounded-md"
                  value={formData.specialty}
                  onChange={handleChange}
                >
                  {specialties.map(specialty => (
                    <option key={specialty.value} value={specialty.value}>
                      {specialty.label}
                    </option>
                  ))}
                </select>
                {errors?.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  max="60"
                  placeholder="e.g. 10"
                  className="w-full border border-blue-900 p-3 rounded-md"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Position / Role 
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  placeholder="e.g. Consultant"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={formData.role}
                  onChange={handleChange}
                />
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                  Education / Institution
                </label>
                <input
                  type="text"
                  id="education"
                  name="education"
                  placeholder="e.g. University of Colombo"
                  className="w-full border border-blue-900 p-3 rounded-md"
                  value={formData.education}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Hospital Affiliations */}
          <section className="p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="mr-2"></span> Hospital Affiliations
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">Select the hospitals where you practice:</p>
              {hospitals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hospitals.map(hospital => (
                    <div key={hospital._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`hospital-${hospital._id}`}
                        checked={selectedHospitals.includes(hospital._id)}
                        onChange={() => handleHospitalSelect(hospital._id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`hospital-${hospital._id}`} className="ml-2 block text-sm text-gray-700">
                        {hospital.name} {hospital.address ? `(${hospital.address})` : ''}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-amber-600 p-3 bg-amber-50 rounded-md">
                  No hospitals found. Please make sure the backend server is running and you have hospitals in the database.
                </div>
              )}
              {errors?.hospitals && <p className="text-red-500 text-sm mt-1">{errors.hospitals}</p>}
            </div>
          </section>

          {/* Availability & Contact */}
          <section className="p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="mr-2"></span> Consultation Hours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Hours 
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Start Time</label>
                    <input
                      type="time"
                      name="consultationStartTime"
                      value={formData.consultationStartTime}
                      onChange={handleChange}
                      className="w-full border border-blue-900 p-3 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">End Time</label>
                    <input
                      type="time"
                      name="consultationEndTime"
                      value={formData.consultationEndTime}
                      onChange={handleChange}
                      className="w-full border border-blue-900 p-3 rounded-md"
                    />
                  </div>
                </div>
                {errors?.consultationTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.consultationTime}</p>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="mr-2 animate-spin">⌛</span>
              ) : (
                <span className="mr-2">💾</span>
              )}
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;