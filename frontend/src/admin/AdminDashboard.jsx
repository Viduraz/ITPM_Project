// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const navigate = useNavigate();

  // Form states for editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    IdNumber: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/auth/users/patient', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setPatients(response.data.patients);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching patients');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        return;
      }
      
      await axios.delete(`http://localhost:3000/api/auth/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Remove the deleted patient from the state
      setPatients(patients.filter(patient => patient.user.id !== id));
      setShowConfirmDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete patient');
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Find the patient in the current state instead of making another API call
      const patientToEdit = patients.find(patient => patient.user.id === id);
      
      if (!patientToEdit) {
        setError('Patient not found.');
        setLoading(false);
        return;
      }
      
      // Navigate to edit page with patient data from current state
      navigate(`/admin/patients/edit/${id}`, { 
        state: { 
          patient: patientToEdit 
        } 
      });
      
    } catch (err) {
      console.error('Edit error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to retrieve patient details for editing');
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setShowConfirmDelete(id);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-gray-600">Manage patient records</p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Patient List</h3>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/patients/add')}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center"
          >
            <span className="mr-1">+</span> Add Patient
          </button>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Total: {patients.length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {patient.user.firstName} {patient.user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.user.contactNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.user.IdNumber || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(patient.user.id)} 
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    
                    {showConfirmDelete === patient.user.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDelete(patient.user.id)}
                          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="text-gray-600 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => confirmDelete(patient.user.id)}
                        className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length === 0 && (
        <div className="text-center p-6 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-500">No patients found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;