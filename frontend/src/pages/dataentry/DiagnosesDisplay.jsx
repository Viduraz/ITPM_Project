import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DiagnosisReport from './DiagnosisReport';
import { FaEdit, FaTrash, FaUserMd, FaUser, FaHospital, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DiagnosesDisplay = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
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
      // Show success message
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DiagnosisReport />
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-900">Diagnoses Records</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search diagnoses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <FaSearch />
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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
        </div>
      )}

      <AnimatePresence>
        {filteredDiagnoses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 py-8"
          >
            No diagnoses found matching your search.
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredDiagnoses.map((diagnosis) => (
              <motion.div
                key={diagnosis._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-600">{diagnosis.condition}</h3>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {new Date(diagnosis.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-600 line-clamp-2">{diagnosis.diagnosisDetails}</p>
                    
                    <div className="flex items-center text-gray-500">
                      <FaUser className="mr-2" />
                      <span>{`${diagnosis.patientId?.userId?.firstName || 'Unknown'} ${diagnosis.patientId?.userId?.lastName || ''}`}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <FaUserMd className="mr-2" />
                      <span>{`${diagnosis.doctorId?.userId?.firstName || 'Unknown'} ${diagnosis.doctorId?.userId?.lastName || ''}`}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <FaHospital className="mr-2" />
                      <span>{diagnosis.hospitalId?.name || 'N/A'}</span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200 flex justify-end space-x-3">
                      <button
                        onClick={() => handleUpdate(diagnosis._id)}
                        className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        <FaEdit className="mr-1" />
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(diagnosis._id)}
                        className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
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
