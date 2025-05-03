import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const DoctorAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor || {
    id: "",
    image: "https://via.placeholder.com/150",
    name: "Dr. Example",
    title: "Allergy Specialist",
    experience: "10 years",
    specialization: "Allergy and Immunology",
    sessions: [
      {
        date: "March 29, 2025",
        time: "01:00 PM",
        location: "ASIRI Hospital - Colombo",
        appointments: 25,
        status: "FULL",
      },
      {
        date: "March 31, 2025",
        time: "06:30 AM",
        location: "ASIRI Hospital - Colombo",
        appointments: 9,
        status: "FULL",
      },
      {
        date: "April 05, 2025",
        time: "01:00 PM",
        location: "ASIRI Hospital - Colombo",
        appointments: 4,
        status: "AVAILABLE",
      },
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/patient/find-doctors")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Doctors
        </button>
      </div>

      {/* Doctor Info Card - Full Width */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 mb-6"
      >
        <div className="flex items-center gap-8">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-indigo-100"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {doctor.name}
            </h1>
            <p className="text-xl text-indigo-600 mb-2">{doctor.title}</p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Experience:</span>{" "}
              {doctor.experience}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Specialization:</span>{" "}
              {doctor.specialization}
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-indigo-800">
                <span className="font-semibold">Special Notes:</span> SRI
                JAYAWARDENEPURA FACULTY / NO REFUNDS AND CANCELLATIONS
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Sessions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-green-100 p-2 rounded-full mr-2">📅</span>
          Upcoming Sessions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Appointments
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctor.sessions?.map((session, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.date} - {session.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.appointments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        session.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : session.status === "FULL"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.status === "AVAILABLE" ? (
                      <button
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-md text-sm font-medium transition"
                        onClick={() =>
                          toast.info("Booking functionality would go here!")
                        }
                      >
                        Book
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Unavailable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoctorAvailability;