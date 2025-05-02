import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availabilityForm, setAvailabilityForm] = useState({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    isAvailable: false,
  });
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [storedAvailability, setStoredAvailability] = useState(null);

  const navigate = useNavigate();

  // Get doctor ID from localStorage instead of using a hardcoded value
  const doctorId = localStorage.getItem("doctorId");

  // If no doctorId is found in localStorage, redirect to login
  useEffect(() => {
    if (!doctorId) {
      navigate("/login");
    }
  }, [doctorId, navigate]);

  // Calendar related functions
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleAvailabilityToggle = () => {
    setAvailabilityForm({
      ...availabilityForm,
      isAvailable: !availabilityForm.isAvailable,
    });
  };

  const handleDateChange = (e) => {
    setAvailabilityForm({
      ...availabilityForm,
      date: e.target.value,
    });
  };

  const handleTimeChange = (field, value) => {
    setAvailabilityForm({
      ...availabilityForm,
      [field]: value,
    });
  };

  const handleUpdateAvailability = async () => {
    try {
      // Create a copy of the form data to ensure we don't modify the original
      const formData = { ...availabilityForm };

      // Make sure the date is just the ISO date string without time part
      // This prevents timezone issues
      if (formData.date) {
        // Keep the date as a string in YYYY-MM-DD format
        // Don't create a new Date object which could cause timezone shifts
        formData.date = formData.date.split("T")[0];
      }

      // API request with the sanitized data
      const response = await fetch(
        `http://localhost:3000/api/doctors/${doctorId}/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      const updatedAvailability = await response.json();

      // Update the doctor state with the new availability
      setDoctor({
        ...doctor,
        availability: updatedAvailability,
      });

      // Show success message
      alert("Availability updated successfully!");

      // Refresh availability
      fetchDoctorAvailability();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days of the week before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8 w-8 rounded-full mx-auto"></div>
      );
    }

    // Function to compare dates ignoring timezone
    const compareDates = (date1, date2) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return (
        d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate()
      );
    };

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Use UTC date to prevent timezone shifts
      const date = new Date(Date.UTC(year, month, day));
      const dateString = date.toISOString().split("T")[0];

      // Check if this date has any availability slots - using UTC date comparison
      const availabilityForDay = doctor.availability?.filter((slot) => {
        const slotDate = new Date(slot.date);
        return compareDates(slotDate, date);
      });

      const isAvailable = availabilityForDay?.some((slot) => slot.isAvailable);
      const today = new Date();
      const isToday = compareDates(today, date);

      let dayClasses =
        "h-8 w-8 rounded-full flex items-center justify-center mx-auto text-sm";

      if (isToday) {
        dayClasses += " bg-indigo-100 font-bold text-indigo-800";
      }

      if (isAvailable) {
        dayClasses += " border-2 border-green-500"; // Green border for available days
      } else if (availabilityForDay && availabilityForDay.length > 0) {
        dayClasses += " border-2 border-red-500"; // Red border for marked unavailable days
      }

      days.push(
        <div
          key={day}
          className={dayClasses}
          onClick={() => {
            setAvailabilityForm({
              ...availabilityForm,
              date: dateString,
            });
          }}
          title={
            isAvailable
              ? "Available"
              : availabilityForDay?.length > 0
              ? "Unavailable"
              : "No availability set"
          }
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const getMonthName = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);

        // Try to fetch from API
        try {
          const response = await fetch(
            `http://localhost:3000/api/doctors/${doctorId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch doctor data");
          }

          const data = await response.json();
          setDoctor(data);
        } catch (err) {
          // Use mock data if API fails
          console.log("Using mock data due to API error:", err.message);
          setDoctor({
            _id: "mock123",
            name: "Dr. Smith",
            email: "dr.smith@example.com",
            specialization: "Cardiology",
            contactNumber: "+94771234567",
            qualification: "MD, MBBS",
            experience: 10,
            availability: [
              {
                _id: "avail1",
                date: new Date("2023-05-15"),
                startTime: "09:00",
                endTime: "12:00",
                isAvailable: true,
              },
              {
                _id: "avail2",
                date: new Date("2023-05-16"),
                startTime: "14:00",
                endTime: "17:00",
                isAvailable: false,
              },
            ],
          });
        }

        // Mock statistics - in a real app, these would come from the API
        setStats({
          totalAppointments: 45,
          upcomingAppointments: 12,
          completedAppointments: 30,
          cancelledAppointments: 3,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
    fetchDoctorAvailability();
  }, [doctorId]);

  const fetchDoctorAvailability = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/doctors/${doctorId}/availability`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch availability data");
      }

      const availabilityData = await response.json();

      // Update the doctor's availability
      if (doctor) {
        setDoctor((prevDoctor) => ({
          ...prevDoctor,
          availability: availabilityData,
        }));
      } else {
        // Store availability data to be used once doctor data is loaded
        setStoredAvailability(availabilityData);
      }
    } catch (err) {
      console.error("Error fetching availability:", err.message);
    }
  };

  const handleAvailabilityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAvailabilityForm({
      ...availabilityForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        `http://localhost:3000/api/doctors/${doctorId}/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(availabilityForm),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      const updatedAvailability = await response.json();

      // Update the doctor state with the new availability
      setDoctor({
        ...doctor,
        availability: updatedAvailability,
      });

      // Reset form and close modal
      setAvailabilityForm({
        date: "",
        startTime: "",
        endTime: "",
        isAvailable: true,
      });
      setShowAvailabilityModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("doctorName");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No doctor data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            <span className="text-indigo-600">Doctor</span> Dashboard
          </h1>
          <div className="flex gap-2">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
                  clipRule="evenodd"
                />
              </svg>
              Generate Report
            </button>
            <a
              href="/doctor/profile"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-center"
            >
              View Profile
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 4a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                  clipRule="evenodd"
                />
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 10a2 2 0 114 0 2 2 0 01-4 0z" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-1">
                  Good Morning,{" "}
                  <span className="text-indigo-600">
                    {doctor.name.split(" ")[1]}
                  </span>
                </h2>
                <p className="text-gray-500">Have a nice day at work</p>
              </div>
              <img
                src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg"
                alt="Doctors illustration"
                className="h-24"
              />
            </div>

            {/* Date, Time, and Availability Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-6">
              {/* Date Selection */}
              <div>
                <div className="flex items-center mb-2">
                  <svg
                    className="h-6 w-6 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <label className="text-gray-700 font-medium">
                    Select Date
                  </label>
                </div>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="May 1, 2025"
                  value={
                    availabilityForm.date
                      ? new Date(availabilityForm.date).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )
                      : ""
                  }
                  onClick={() =>
                    document.getElementById("hidden-date-input").showPicker()
                  }
                  readOnly
                />
                <input
                  id="hidden-date-input"
                  type="date"
                  className="hidden"
                  value={availabilityForm.date}
                  onChange={handleDateChange}
                />
              </div>

              {/* Start Time */}
              <div>
                <div className="flex items-center mb-2">
                  <svg
                    className="h-6 w-6 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <label className="text-gray-700 font-medium">
                    Start Time
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="09:00 AM"
                    value={
                      availabilityForm.startTime
                        ? new Date(
                            `2000-01-01T${availabilityForm.startTime}`
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""
                    }
                    onClick={() =>
                      document.getElementById("hidden-start-time").showPicker()
                    }
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <input
                    id="hidden-start-time"
                    type="time"
                    className="hidden"
                    value={availabilityForm.startTime}
                    onChange={(e) =>
                      handleTimeChange("startTime", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* End Time */}
              <div>
                <div className="flex items-center mb-2">
                  <svg
                    className="h-6 w-6 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <label className="text-gray-700 font-medium">End Time</label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="05:00 PM"
                    value={
                      availabilityForm.endTime
                        ? new Date(
                            `2000-01-01T${availabilityForm.endTime}`
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""
                    }
                    onClick={() =>
                      document.getElementById("hidden-end-time").showPicker()
                    }
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <input
                    id="hidden-end-time"
                    type="time"
                    className="hidden"
                    value={availabilityForm.endTime}
                    onChange={(e) =>
                      handleTimeChange("endTime", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Status with Toggle */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">
                    Status:
                  </span>
                  <span
                    className={`font-medium ${
                      availabilityForm.isAvailable
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {availabilityForm.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Toggle Switch */}
                <div
                  className={`relative inline-block w-14 h-8 rounded-full transition-colors ease-in-out duration-200 focus:outline-none ${
                    availabilityForm.isAvailable
                      ? "bg-indigo-600"
                      : "bg-gray-300"
                  }`}
                  onClick={handleAvailabilityToggle}
                >
                  <span
                    className={`inline-block w-6 h-6 transform translate-x-1 bg-white rounded-full transition ease-in-out duration-200 ${
                      availabilityForm.isAvailable
                        ? "translate-x-7"
                        : "translate-x-1"
                    }`}
                  />
                </div>
              </div>

              {/* Update Button */}
              <button
                onClick={handleUpdateAvailability}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md transition duration-300"
              >
                Update Availability
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Calendar
                </h2>
              </div>

              <div className="text-center mb-4">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <h3 className="font-medium">{getMonthName(currentMonth)}</h3>
                  <button
                    onClick={goToNextMonth}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-500 mb-1">
                  <div>Su</div>
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sa</div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-sm">
                  {renderCalendarDays()}
                </div>
                <div className="mt-4 text-xs text-gray-500 space-y-2">
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full border-2 border-green-500 mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full border-2 border-red-500 mr-2"></div>
                    <span>Unavailable</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-indigo-100 mr-2"></div>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium">Appointment confirmed for 2 PM</p>
                  <p className="text-xs text-gray-500 mt-1">10 min ago</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium">New patient message received</p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium">Lab results are ready to review</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Add Availability Slot
                </h3>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAvailabilitySubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-medium mb-2"
                    htmlFor="date"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    value={availabilityForm.date}
                    onChange={handleAvailabilityChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-medium mb-2"
                      htmlFor="startTime"
                    >
                      Start Time
                    </label>
                    <input
                      id="startTime"
                      name="startTime"
                      type="time"
                      required
                      value={availabilityForm.startTime}
                      onChange={handleAvailabilityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 text-sm font-medium mb-2"
                      htmlFor="endTime"
                    >
                      End Time
                    </label>
                    <input
                      id="endTime"
                      name="endTime"
                      type="time"
                      required
                      value={availabilityForm.endTime}
                      onChange={handleAvailabilityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={availabilityForm.isAvailable}
                      onChange={handleAvailabilityChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">
                      Available for booking
                    </span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAvailabilityModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
