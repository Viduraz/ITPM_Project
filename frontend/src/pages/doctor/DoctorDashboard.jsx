import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaHospital, FaClock, FaCalendarAlt, FaBell, FaChevronDown } from 'react-icons/fa';
import doctorGreeting1 from '../../../public/images/doctorGreeting1.png';
import axios from 'axios';
import { useAuth } from '../../pages/context/AuthContext';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [availability, setAvailability] = useState({
    isAvailable: false,
    hospitals: {}
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState({
    from: '09:00',
    to: '17:00'
  });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);

  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch doctor profile and hospital affiliations
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setErrorMessage('Authentication token not found. Please log in again.');
          setIsLoading(false);
          return;
        }

        try {
          // Fetch doctor profile
          const profileResponse = await axios.get(`${API_BASE_URL}/doctor/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (profileResponse.data && profileResponse.data.doctor) {
            const doctorData = profileResponse.data.doctor;
            setDoctorProfile(doctorData);
            
            // Set availability status from most recent entry
            if (doctorData.availabilitySchedule && doctorData.availabilitySchedule.length > 0) {
              // Sort by date, most recent first
              const schedules = [...doctorData.availabilitySchedule].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
              );
              
              const latestSchedule = schedules[0];
              setAvailability({
                isAvailable: latestSchedule.isAvailable,
                hospitals: {}
              });
              
              if (latestSchedule.hours) {
                setSelectedTime({
                  from: latestSchedule.hours.from || '09:00',
                  to: latestSchedule.hours.to || '17:00'
                });
              }
            }
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          // Continue with hospitals even if profile fails
        }

        try {
          // Fetch hospitals separately to ensure it runs even if profile fails
          const hospitalsResponse = await axios.get(`${API_BASE_URL}/doctor/hospitals`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (hospitalsResponse.data && hospitalsResponse.data.hospitals) {
            setHospitals(hospitalsResponse.data.hospitals);
          }
        } catch (hospitalsError) {
          console.error('Error fetching hospitals:', hospitalsError);
          setErrorMessage('Failed to load hospitals. Please try again later.');
        }
      } catch (error) {
        console.error('Error in doctor data fetch:', error);
        setErrorMessage('Failed to load data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const handleProfileClick = () => {
    navigate('/doctor/profile');
  };

  const handleHospitalChange = (e) => {
    const hospitalId = e.target.value;
    setSelectedHospital(hospitals.find(h => h._id === hospitalId) || null);
  };

  const toggleAvailability = () => {
    if (selectedHospital) {
      setAvailability(prev => ({
        ...prev,
        [selectedHospital._id]: !prev[selectedHospital._id]
      }));
    }
  };

  const handleUpdateAvailability = async () => {
    const validateDateTime = () => {
      const currentDateTime = new Date();
      const selectedDateTime = new Date(selectedDate);
      
      if (selectedDateTime < currentDateTime) {
        setErrorMessage('Please select a future date for availability.');
        return false;
      }
      
      // Validate time range
      if (selectedTime.from >= selectedTime.to) {
        setErrorMessage('End time must be after start time.');
        return false;
      }
      
      setErrorMessage('');
      return true;
    };

    if (!validateDateTime()) {
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrorMessage('Authentication token not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      // Call API to update availability for all hospitals
      // You'll need to modify your backend to handle this differently
      const response = await axios.put(
        `${API_BASE_URL}/doctor/availability/global`, 
        {
          isAvailable: availability.isAvailable,
          date: selectedDate.toISOString().split('T')[0],
          timeFrom: selectedTime.from,
          timeTo: selectedTime.to
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccessMessage('Your availability has been updated successfully.');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating availability:', error);
      setErrorMessage('Failed to update availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of your component remains the same
  const notifications = [
    {
      id: 1,
      text: 'Appointment confirmed for 2 PM',
      type: 'appointment',
      time: '10 min ago'
    },
    {
      id: 2,
      text: 'New patient message received',
      type: 'message',
      time: '1 hour ago'
    },
    {
      id: 3,
      text: 'Lab results are ready to review',
      type: 'lab',
      time: '2 hours ago'
    }
  ];

  // Render with loading state
  if (isLoading && !doctorProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {successMessage && (
        <div className="fixed top-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg z-50 animate-fade-in">
          {successMessage}
        </div>
      )}
      
      <div className="flex flex-1 gap-6 p-6">
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="text-indigo-600">Doctor</span> Dashboard
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/doctor/report-generation')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:-translate-y-1 hover:shadow-lg flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Generate Report
              </button>
              <button
                onClick={handleProfileClick}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Greeting Banner */}
          <div className="bg-white p-6 mb-6 rounded-xl flex items-center shadow-lg animate-slide-in hover:shadow-xl transition-all">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                Good Morning, <span className="text-indigo-600">Dr. {user?.firstName || 'Doctor'}</span>
              </h2>
              <p className="text-gray-500 mt-1">Have a nice day at work</p>
            </div>
            {/* Replace with your actual illustration */}
            <img
              src={doctorGreeting1}
              alt="Doctor Illustration"
              className="h-30 w-auto"
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">
                <FaCalendarAlt className="inline mr-2 text-indigo-600" />
                Set Your Availability
              </h3>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-gray-700">
                    <span className="text-lg font-medium">Availability Status</span>
                    <div className="relative inline-block w-14 mr-2 align-middle select-none transition-all">
                      <input
                        type="checkbox"
                        checked={availability.isAvailable || false}
                        onChange={() => setAvailability(prev => ({
                          ...prev,
                          isAvailable: !prev.isAvailable
                        }))}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          availability.isAvailable
                            ? 'bg-green-400'
                            : 'bg-gray-300'
                        }`}
                      />
                    </div>
                    <span className={`text-sm font-medium ${availability.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {availability.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaCalendarAlt className="inline mr-2" />
                      Available Date
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={setSelectedDate}
                      minDate={new Date()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FaClock className="inline mr-2" />
                      Available Time
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">From</label>
                        <input
                          type="time"
                          value={selectedTime.from || '09:00'}
                          onChange={(e) => setSelectedTime(prev => ({...prev, from: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">To</label>
                        <input
                          type="time"
                          value={selectedTime.to || '17:00'}
                          onChange={(e) => setSelectedTime(prev => ({...prev, to: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <button 
                  onClick={handleUpdateAvailability}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Availability'}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* The rest of your component remains the same */}
        <aside className="hidden lg:block w-80 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <FaCalendarAlt className="inline mr-2 text-indigo-600" />
              Calendar
            </h3>
            <div className="calendar-wrapper">
              <DatePicker
                selected={calendarDate}
                onChange={(date) => setCalendarDate(date)}
                inline
                className="custom-calendar"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              <FaBell className="inline mr-2 text-indigo-600" />
              Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((note, index) => (
                <div
                  key={note.id}
                  className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 hover:shadow-md transition-all animate-fade-in"
                  style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                >
                  <p className="text-gray-800">{note.text}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {note.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-label {
          transition: background-color 0.2s ease-in;
        }
        .calendar-wrapper .react-datepicker {
          border: none;
          font-family: inherit;
        }
        .react-datepicker__header {
          background-color: #EEF2FF;
          border-bottom: none;
        }
        .react-datepicker__day--selected {
          background-color: #4F46E5 !important;
        }
        .react-datepicker__day:hover {
          background-color: #E0E7FF !important;
        }

        /* Add these new animation styles */
        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .hover-pulse:hover {
          animation: pulse 1s infinite;
        }

        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
