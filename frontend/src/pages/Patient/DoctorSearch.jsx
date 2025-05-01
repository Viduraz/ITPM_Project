// src/pages/patient/DoctorSearch.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// Keep your specialties list
const specialties = [
  { id: 'anesthesiology', name: 'Anesthesiology & Reanimation' },
  { id: 'dentistry',       name: 'Dentistry' },
  { id: 'dermatology',     name: 'Dermatology' },
  { id: 'ent',             name: 'Ear-Nose-Throat / Audiology' },
  { id: 'internal-med',    name: 'Internal Medicine' },
  { id: 'obgyn',           name: 'Obstetrics and Gynecology' },
  { id: 'orthopedics',     name: 'Orthopedics and Traumatology' },
  { id: 'pediatrics',      name: 'Pediatrics' },
  { id: 'radiology',       name: 'Radiology' },
  { id: 'urology',         name: 'Urology' },
];

const DoctorSearch = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [error, setError] = useState(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  // Fetch doctors based on specialty
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let endpoint = 'http://localhost:3001/api/doctors';
        
        // If specialty is provided, add it as a query parameter
        if (specialty) {
          endpoint = `http://localhost:3001/api/patients/doctors/search?query=${specialty}`;
        }
        
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Process the response based on whether it's a list of doctors or a search result
        const doctorsData = specialty ? response.data.doctors : response.data;
        
        // Map backend data to match your frontend structure
        const mappedDoctors = doctorsData.map(doctor => ({
          id: doctor._id,
          name: doctor.name || `Dr. ${doctor.userId?.firstName} ${doctor.userId?.lastName}`,
          title: doctor.specialization || 'Specialist',
          specialty: doctor.specialization,
          image: doctor.userId?.profileImage || 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
          rating: 4.7, // Add default or calculate from reviews if available
          experience: `${doctor.experience || 5}+ years`,
          specialization: doctor.specialization,
          contactNumber: doctor.contactNumber,
          qualification: doctor.qualification,
          // You might need to transform availability data to match your UI expectations
          sessions: doctor.availability?.map(slot => ({
            date: new Date(slot.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: slot.startTime,
            appointments: 10, // This could be calculated or fetched from another endpoint
            status: slot.isAvailable ? 'AVAILABLE' : 'FULL',
            location: 'Main Hospital' // You might need to add hospital info to your backend
          })) || []
        }));
        
        if (specialty) {
          setDoctors(mappedDoctors);
        } else {
          // For the homepage, set the first 3 doctors as featured
          setFeaturedDoctors(mappedDoctors.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to fetch doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty]);

  // Function to handle search
  useEffect(() => {
    const searchDoctors = async () => {
      if (!searchQuery) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/patient/doctors/search?query=${searchQuery}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const mappedDoctors = response.data.doctors.map(doctor => ({
          id: doctor._id,
          name: doctor.name || `Dr. ${doctor.userId?.firstName} ${doctor.userId?.lastName}`,
          title: doctor.specialization || 'Specialist',
          specialty: doctor.specialization,
          image: doctor.userId?.profileImage || 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
          rating: 4.7,
          experience: `${doctor.experience || 5}+ years`,
          specialization: doctor.specialization,
          contactNumber: doctor.contactNumber,
          qualification: doctor.qualification,
          sessions: doctor.availability?.map(slot => ({
            date: new Date(slot.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            time: slot.startTime,
            appointments: 10,
            status: slot.isAvailable ? 'AVAILABLE' : 'FULL',
            location: 'Main Hospital'
          })) || []
        }));
        
        setDoctors(mappedDoctors);
      } catch (err) {
        console.error('Error searching doctors:', err);
        setError('Failed to search doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const debounceTimeout = setTimeout(() => {
      if (searchQuery) {
        searchDoctors();
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleViewProfile = (doctor) => {
    navigate('/doctor-availability', { state: { doctor } });
  };

  const filteredDoctors = () => {
    // If we're on a specialty page or searching, use the doctors state
    // otherwise use the featured doctors for the homepage
    return specialty || searchQuery ? doctors : featuredDoctors;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-purple-200 shadow p-4">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Our Healthcare Professionals
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative max-w-2xl"
          >
            <input
              type="text"
              placeholder="Search by doctor name or specialty (e.g. Dr. Smith, Cardiology)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 shadow-sm"
            />
            <svg
              className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 mt-6 flex">
        <motion.aside 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/4 mr-6 bg-white shadow rounded p-4"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Specialties
          </h2>
          <ul className="space-y-2">
            {specialties.map((spec) => (
              <li key={spec.id}>
                <Link
                  to={`/doctor-search/${spec.id}`}
                  className={`block px-2 py-1 rounded hover:bg-gray-100 ${
                    specialty === spec.id ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  {spec.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.aside>

        <motion.main 
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white shadow rounded p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Our highly skilled medical team
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Select a specialty from the left menu to see the doctors.
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : filteredDoctors().length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredDoctors().map((doc) => (
                <motion.div
                  key={doc.id}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.title}</p>
                      <p className="text-sm text-indigo-600">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Experience:</span> {doc.experience || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Specialization:</span> {doc.specialization || doc.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Qualification:</span> {doc.qualification || 'MD'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Rating:</span>{' '}
                      <span className="text-yellow-500">★</span> {doc.rating || '4.5'}
                    </p>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewProfile(doc)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    View Profile & Availability
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500"
            >
              No doctors found matching your search criteria.
            </motion.p>
          )}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default DoctorSearch;
