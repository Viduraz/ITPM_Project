import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    contactNumber: "",
    qualification: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Get doctor ID from localStorage instead of using a hardcoded value
  const doctorId = localStorage.getItem("doctorId");

  // If no doctorId is found in localStorage, redirect to login
  useEffect(() => {
    if (!doctorId) {
      navigate("/login");
    }
  }, [doctorId, navigate]);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) return; // Skip fetch if no doctorId

      try {
        setLoading(true);

        // Try to fetch from API
        try {
          const response = await fetch(
            `http://localhost:3001/api/doctors/${doctorId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch doctor data");
          }

          const data = await response.json();
          setDoctor(data);

          // Initialize form data
          setFormData({
            name: data.name,
            email: data.email,
            specialization: data.specialization,
            contactNumber: data.contactNumber,
            qualification: data.qualification,
            experience: data.experience,
            password: "",
            confirmPassword: "",
          });
        } catch (err) {
          // Use mock data if API fails
          console.log("Using mock data due to API error:", err.message);
          const mockData = {
            _id: doctorId,
            name: "Dr. Jane Smith",
            email: "jane.smith@example.com",
            specialization: "Cardiology",
            contactNumber: "+94771234567",
            qualification: "MD, MBBS",
            experience: 8,
            createdAt: new Date("2022-05-15"),
          };

          setDoctor(mockData);
          setFormData({
            name: mockData.name,
            email: mockData.email,
            specialization: mockData.specialization,
            contactNumber: mockData.contactNumber,
            qualification: mockData.qualification,
            experience: mockData.experience,
            password: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setNotification({
        show: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      // Prepare data for update - remove confirmPassword and empty password
      const updateData = { ...formData };
      delete updateData.confirmPassword;
      if (!updateData.password) delete updateData.password;

      // Call API to update doctor info
      try {
        const response = await fetch(
          `http://localhost:3001/api/doctors/${doctorId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update profile");
        }

        const updatedDoctor = await response.json();
        setDoctor({
          ...doctor,
          ...updatedDoctor,
        });

        setNotification({
          show: true,
          message: "Profile updated successfully",
          type: "success",
        });

        // Close edit mode
        setIsEditing(false);

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } catch (err) {
        console.log("API error:", err.message);
        // For demo, pretend update was successful
        setDoctor({
          ...doctor,
          name: formData.name,
          email: formData.email,
          specialization: formData.specialization,
          contactNumber: formData.contactNumber,
          qualification: formData.qualification,
          experience: formData.experience,
        });

        setNotification({
          show: true,
          message: "Profile updated successfully (mock)",
          type: "success",
        });

        setIsEditing(false);
      }
    } catch (err) {
      setNotification({
        show: true,
        message: err.message,
        type: "error",
      });
    }
  };

  // Hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="text-2xl font-bold text-center text-gray-800">
            Doctor Profile
          </h1>

          <div className="w-24">{/* Spacer for centering the title */}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-6 p-4 rounded-md ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header with Background */}
          <div className="h-48 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 relative">
            <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
              <div className="h-32 w-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
          </div>

          <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            {isEditing ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Specialization */}
                  <div>
                    <label
                      htmlFor="specialization"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Specialization
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label
                      htmlFor="contactNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Qualification */}
                  <div>
                    <label
                      htmlFor="qualification"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Qualifications
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Password fields */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Update Password (optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {doctor.name}
                  </h2>
                  <p className="text-xl text-indigo-600 font-medium">
                    {doctor.specialization}
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mt-1 text-lg font-medium">{doctor.email}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Contact
                      </h3>
                      <p className="mt-1 text-lg font-medium">
                        {doctor.contactNumber}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Qualifications
                      </h3>
                      <p className="mt-1 text-lg font-medium">
                        {doctor.qualification}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Experience
                      </h3>
                      <p className="mt-1 text-lg font-medium">
                        {doctor.experience} years
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Joined On
                      </h3>
                      <p className="mt-1 text-lg font-medium">
                        {new Date(doctor.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-blue-500">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-gray-500 text-sm font-medium">
                            Total Appointments
                          </h4>
                          <p className="text-2xl font-bold">354</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-green-500">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="bg-green-100 rounded-full p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-gray-500 text-sm font-medium">
                            Patients Treated
                          </h4>
                          <p className="text-2xl font-bold">156</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg overflow-hidden border-t-4 border-yellow-500">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="bg-yellow-100 rounded-full p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-gray-500 text-sm font-medium">
                            Rating
                          </h4>
                          <p className="text-2xl font-bold">4.8/5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;
