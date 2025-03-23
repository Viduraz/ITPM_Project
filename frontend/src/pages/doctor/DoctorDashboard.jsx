import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaHospital, FaClock, FaCalendarAlt, FaBell, FaChevronDown } from 'react-icons/fa';
import doctorGreeting1 from '../../../public/images/doctorGreeting1.png'

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState('');

  const hospitals = [
    {
      id: 1,
      name: 'Central Hospital',
      address: '123 Medical Center Blvd',
      department: 'Cardiology'
    },
    {
      id: 2,
      name: 'City Medical Center',
      address: '456 Healthcare Ave',
      department: 'General Medicine'
    },
    {
      id: 3,
      name: 'Community Hospital',
      address: '789 Wellness Street',
      department: 'Emergency Care'
    },
    {
      id: 4,
      name: 'Central Hospital',
      address: '123 Medical Center Blvd',
      department: 'Cardiology'
    },
    {
      id: 5,
      name: 'City Medical Center',
      address: '456 Healthcare Ave',
      department: 'General Medicine'
    },
    {
      id: 6,
      name: 'Community Hospital',
      address: '789 Wellness Street',
      department: 'Emergency Care'
    },
    
    
  ];

  const handleProfileClick = () => {
    navigate('/doctor/profile');
  };

  const handleHospitalChange = (e) => {
    setSelectedHospital(hospitals.find(h => h.id === parseInt(e.target.value)));
  };

  const toggleAvailability = () => {
    if (selectedHospital) {
      setAvailability(prev => ({
        ...prev,
        [selectedHospital.id]: !prev[selectedHospital.id]
      }));
    }
  };

  const validateDateTime = () => {
    const currentDateTime = new Date();
    const selectedDateTime = new Date(selectedDate);
    
    // Set the time from the time input
    const [hours, minutes] = selectedTime.split(':');
    selectedDateTime.setHours(parseInt(hours), parseInt(minutes));
  
    if (selectedDateTime < currentDateTime) {
      setErrorMessage('Please select a future date and time for availability.');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };
  
  const handleUpdateAvailability = () => {
    if (!validateDateTime()) {
      return;
    }
    // Your existing update logic here
    console.log('Availability updated successfully');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <div className="flex flex-1 gap-6 p-6">
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="text-indigo-600">Doctor</span> Dashboard
            </h2>
            <button
              onClick={handleProfileClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              View Profile
            </button>
          </div>

          {/* Greeting Banner */}
          <div className="bg-white p-6 mb-6 rounded-xl flex items-center shadow-lg animate-slide-in hover:shadow-xl transition-all">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">
                Good Morning, <span className="text-indigo-600">Dr. Smith</span>
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
              <div className="flex items-center space-x-4">
                <FaHospital className="text-indigo-600 text-xl" />
                <select
                  onChange={handleHospitalChange}
                  value={selectedHospital?.id || ''}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.department}
                    </option>
                  ))}
                </select>
              </div>

              {selectedHospital && (
                <div className="space-y-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-gray-700">
                      <span>Available Today</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition-all">
                        <input
                          type="checkbox"
                          checked={availability[selectedHospital.id] || false}
                          onChange={toggleAvailability}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                            availability[selectedHospital.id]
                              ? 'bg-green-400'
                              : 'bg-gray-300'
                          }`}
                        />
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaCalendarAlt className="inline mr-2" />
                        Select Date
                      </label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={setSelectedDate}
                        minDate={new Date()} // This will disable all past dates
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FaClock className="inline mr-2" />
                        Select Time
                      </label>
                      <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
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
                  >
                    Update Availability
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

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
