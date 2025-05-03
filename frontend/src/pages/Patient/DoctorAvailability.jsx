import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import api from '../../utils/api'; // Import the API utility

const DoctorAvailability = () => {
  const location = useLocation();
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(location.state?.doctor || {});
  const [loading, setLoading] = useState(!location.state?.doctor);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  // Fetch doctor data if not provided in location state
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!location.state?.doctor && doctorId) {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          const response = await api.getDoctorProfile(doctorId, token);
          
          if (response.data && response.data.doctor) {
            const doctorData = transformDoctorData(response.data.doctor);
            setDoctor(doctorData);
          }
        } catch (err) {
          console.error('Error fetching doctor data:', err);
          setError('Failed to load doctor information. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
      
      // Fetch reviews - this would be a real API call in production
      // Using dummy data for now
      setReviews([
        {
          name: "John D.",
          rating: 5,
          date: "March 15, 2024",
          comment: "Excellent doctor! Very knowledgeable and patient in explaining everything.",
          verified: true
        },
        {
          name: "Sarah M.",
          rating: 4,
          date: "March 10, 2024",
          comment: "Professional and caring. Highly recommend for anyone looking for a specialist.",
          verified: true
        },
        {
          name: "Robert K.",
          rating: 5,
          date: "March 5, 2024",
          comment: "Great experience overall. The doctor took time to address all my concerns.",
          verified: true
        }
      ]);
    };

    fetchDoctorData();
  }, [doctorId, location.state]);

  // Transform doctor data from backend format to frontend format
  const transformDoctorData = (backendDoctor) => {
    // Extract user information
    const user = backendDoctor.userId || {};
    const name = `Dr. ${user.firstName || ''} ${user.lastName || ''}`.trim();
    
    // Create sessions from hospitalAffiliations
    const sessions = backendDoctor.hospitalAffiliations.map(affiliation => {
      const hospital = affiliation.hospital || {};
      return {
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: '01:00 PM', // Default time - in production, this would come from the backend
        location: hospital.name || 'Unknown Hospital',
        appointments: Math.floor(Math.random() * 20) + 1, // Random number for demo
        status: affiliation.isAvailableToday ? 'AVAILABLE' : 'UNAVAILABLE'
      };
    });

    // Other locations - hospitals where the doctor is not available today
    const otherLocations = backendDoctor.hospitalAffiliations
      .filter(affiliation => !affiliation.isAvailableToday)
      .map(affiliation => affiliation.hospital?.name || 'Unknown Hospital');

    return {
      image: user.profileImage || 'https://via.placeholder.com/150',
      name: name,
      title: backendDoctor.qualifications?.[0]?.degree || 'Specialist',
      experience: `${backendDoctor.experience || 'N/A'} years`,
      specialization: backendDoctor.specialization || 'General Medicine',
      sessions: sessions.length > 0 ? sessions : [
        { date: 'No upcoming sessions', time: '', location: '', appointments: 0, status: 'UNAVAILABLE' }
      ],
      otherLocations: otherLocations.length > 0 ? otherLocations : ['No other locations']
    };
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    // In production, this would be an API call to save the review
    alert(`Thank you for your feedback! Your review has been submitted.`);
    
    // Reset form
    setRating(0);
    setReview('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
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
                      {session.date} {session.time ? `- ${session.time}` : ''}
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

      {/* Existing Reviews Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-purple-100 p-2 rounded-full mr-2">💬</span>
            Patient Reviews
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-yellow-400">4.8</span>
            <span className="text-gray-500 text-sm ml-2">({reviews.length} reviews)</span>
          </div>
        </h2>

        {/* Review Cards */}
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800">{review.name}</span>
                    {review.verified && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified Patient
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-gray-500 text-sm ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
        <form className="space-y-6" onSubmit={handleSubmitReview}>
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
