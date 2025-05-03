import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DiagnosisReport from './DiagnosisReport';
import { FaEdit, FaTrash, FaUserMd, FaUser, FaHospital, FaCalendarAlt, FaSearch, FaFilter, FaRegFileAlt, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DiagnosesDisplay = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnoses = async (retryCount = 0) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('http://localhost:3000/api/dataentry/diagnoses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDiagnoses(response.data);
        setFilteredDiagnoses(response.data);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        if (retryCount < 3) {
          setTimeout(() => fetchDiagnoses(retryCount + 1), 1000 * (retryCount + 1));
        } else {
          setErrorMessage('Failed to fetch diagnoses. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  useEffect(() => {
    const filtered = diagnoses.filter(diagnosis => 
      diagnosis.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.patientId?.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.patientId?.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDiagnoses(filtered);
  }, [searchTerm, diagnoses]);

  const handleUpdate = (id) => {
    navigate(`/dataentry/update/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this diagnosis?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/dataentry/diagnoses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDiagnoses(prev => prev.filter(d => d._id !== id));
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
      successMessage.textContent = 'Diagnosis deleted successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      setErrorMessage('Failed to delete diagnosis. Please try again.');
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Records' },
    { value: 'recent', label: 'Recent Records' },
    { value: 'urgent', label: 'Urgent Cases' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    hover: { y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] flex-col">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute top-3 left-3 right-3 bottom-3 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-blue-600 font-medium">Loading diagnoses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diagnosis Records</h1>
            <p className="text-gray-600 mt-1">
              Managing <span className="font-semibold text-indigo-600">{diagnoses.length} records</span> in the system
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/dataentry/patientdiagnosis')} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300">
              <FaPlus className="mr-2" /> New Diagnosis
            </button>
            <button onClick={() => {/* Open report panel */}} 
              className="bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 px-6 py-2.5 rounded-lg font-medium flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
              <FaRegFileAlt className="mr-2" /> Generate Report
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patient name or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
            />
          </div>
          
          <div className="flex gap-2 self-end">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
                  ${activeFilter === option.value
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {filteredDiagnoses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl p-12 text-center shadow-sm border border-dashed border-gray-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
              <FaSearch className="text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No diagnoses found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any diagnoses matching your search criteria. Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDiagnoses.map((diagnosis) => (
              <motion.div
                key={diagnosis._id}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 border border-gray-100"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{diagnosis.condition}</h3>
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      <FaCalendarAlt className="text-blue-500" />
                      {new Date(diagnosis.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-gray-600 line-clamp-2 text-sm">{diagnosis.diagnosisDetails}</p>
                  </div>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-gray-600 text-sm">
                      <div className="w-8">
                        <FaUser className="text-indigo-400" />
                      </div>
                      <span className="font-medium">{`${diagnosis.patientId?.userId?.firstName || 'Unknown'} ${diagnosis.patientId?.userId?.lastName || ''}`}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm">
                      <div className="w-8">
                        <FaUserMd className="text-green-500" />
                      </div>
                      <span>Dr. {`${diagnosis.doctorId?.userId?.firstName || 'Unknown'} ${diagnosis.doctorId?.userId?.lastName || ''}`}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 text-sm">
                      <div className="w-8">
                        <FaHospital className="text-blue-500" />
                      </div>
                      <span>{diagnosis.hospitalId?.name || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleUpdate(diagnosis._id)}
                      className="flex-1 flex items-center justify-center py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
                    >
                      <FaEdit className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(diagnosis._id)}
                      className="flex-1 flex items-center justify-center py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiagnosesDisplay;
