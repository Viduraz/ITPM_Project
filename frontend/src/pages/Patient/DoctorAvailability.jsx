import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const DoctorAvailability = () => {
  const location = useLocation();
  const doctor = location.state?.doctor;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  if (!doctor) {
    return <div>No doctor information available</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-6"
    >
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
            <p className="text-xl text-indigo-600 mb-2">{doctor.title}</p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Experience:</span> {doctor.experience}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Specialization:</span> {doctor.specialization}
            </p>
            <div className="bg-indigo-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-indigo-800">
                <span className="font-semibold">Special Notes:</span> SRI JAYAWARDENEPURA FACULTY / NO REFUNDS AND CANCELLATIONS
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Upcoming Sessions - Left Column */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctor.sessions?.map((session, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${session.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                          session.status === 'FULL' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Other Hospital Sessions - Right Column */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 p-2 rounded-full mr-2">🏥</span>
            Other Hospital Sessions
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctor.otherLocations?.map((location, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="bg-yellow-100 p-2 rounded-full mr-2">⭐</span>
          Rate & Review
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none transition-transform hover:scale-110"
                >
                  <FaStar 
                    className={star <= rating ? 'text-yellow-400' : 'text-gray-300'} 
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-32"
              placeholder="Share your experience with this doctor..."
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transform transition-transform hover:-translate-y-1"
          >
            Submit Review
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DoctorAvailability;
