// src/pages/patient/DoctorSearch.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const DoctorSearch = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  // Add new state for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // List of specialties for filtering
  const specialties = [
    'Cardiology',
    'Dentistry',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry',
    'Oncology',
    'Gynecology',
    'Urology',
    'Ophthalmology'
  ];
  
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

  // Fetch all doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let endpoint = 'http://localhost:3000/api/doctors';
        
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Map backend data to match your frontend structure
        const mappedDoctors = response.data.map(doctor => ({
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
        console.error('Error fetching doctors:', err);
        setError('Failed to fetch doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleViewProfile = (doctor) => {
    // If this is a real doctor from API, navigate with the ID
    if (doctor._id) {
      navigate(`/doctor-availability/${doctor._id}`, { state: { doctor } });
    } else {
      // For mock data doctors
      navigate('/doctor-availability', { state: { doctor } });
    }
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? '' : specialty);
  };

  // Update the filteredDoctors function to include name search
  const filteredDoctors = () => {
    return doctors.filter(doctor => {
      const matchesSpecialty = selectedSpecialty 
        ? doctor.specialization && doctor.specialization.toLowerCase() === selectedSpecialty.toLowerCase()
        : true;
        
      const matchesSearch = searchTerm
        ? doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
        
      return matchesSpecialty && matchesSearch;
    });
  };

  // Add handler for search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ...keep existing return statement...
  
  // Update the loading state rendering
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-purple-200 shadow p-6">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Our Healthcare Professionals
          </motion.h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 mt-6">
        {/* Search Section - New Addition */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Find a Doctor</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by doctor name or specialty..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="md:self-end px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-200 whitespace-nowrap"
              >
                Clear Search
              </button>
            )}
          </div>
        </motion.div>

        {/* Specialties Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter by Specialty</h2>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyChange(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedSpecialty === specialty
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {specialty}
              </button>
            ))}
            {selectedSpecialty && (
              <button
                onClick={() => setSelectedSpecialty('')}
                className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200"
              >
                Clear Filter
              </button>
            )}
          </div>
        </motion.div>

        <motion.main 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Our highly skilled medical team
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Browse our list of professional doctors and book an appointment today.
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-500 text-center">
                {selectedSpecialty
                  ? `No doctors found with specialty: ${selectedSpecialty}`
                  : 'No doctors found matching your search criteria.'}
              </p>
              {selectedSpecialty && (
                <button
                  onClick={() => setSelectedSpecialty('')}
                  className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                >
                  Clear specialty filter
                </button>
              )}
            </motion.div>
          )}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default DoctorSearch;
