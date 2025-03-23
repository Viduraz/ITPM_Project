import React, { useState } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import foamBg from '../../../public/images/foamBg.png'

const DoctorProfile = () => {
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
    consultationEndTime: '17:00'
  });
  const [errors, setErrors] = useState({});

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
      // Updated regex to ensure exactly 9 numbers followed by a single 'v' or 'V'
      if (!/^\d{9}[vV]$/.test(formData.doctorId)) {
        newErrors.doctorId = 'Old NIC must have exactly 9 numbers followed by V';
      }
    } else {
      if (!/^\d{12}$/.test(formData.doctorId)) {
        newErrors.doctorId = 'New NIC must have 12 numbers';
      }
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
    } else if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit form data
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div 
      className="min-h-screen p-6 w-full   text-gray-800"
      
    >
      {/* Header */}
      <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-indigo-800 transform hover:scale-105 transition-transform duration-300 hover:text-indigo-600 cursor-default">
  Doctor Profile Setup
</h1>
        
        <p className="text-gray-600">Complete your professional profile to get started</p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl  mx-auto /95 p-8 rounded-lg shadow-2xl  transition-shadow duration-300">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <section className=" p-6 rounded-lg border border-blue-900">
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

              {/* Existing specialty field */}
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
            </div>
          </section>

          {/* Availability & Contact */}
          <section className=" p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="mr-2"></span> Availability & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="locations" className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Locations 
                </label>
                <textarea
                  id="locations"
                  name="locations"
                  rows={3}
                  placeholder="List your clinics or hospitals"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={formData.locations}
                  onChange={handleChange}
                />
              </div>

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
            >
              <span className="mr-2"></span>
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
