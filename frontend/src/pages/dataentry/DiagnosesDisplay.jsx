import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DiagnosisReport from './DiagnosisReport';


const DiagnosesDisplay = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/dataentry/diagnoses', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        console.log('API Response:', response.data);  // Log response to verify data

        setDiagnoses(response.data);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        setErrorMessage('An error occurred while fetching diagnoses.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/dataentry/update/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this diagnosis?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/dataentry/diagnoses/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        setDiagnoses(diagnoses.filter(d => d._id !== id));
        alert('Diagnosis deleted successfully');
      } catch (error) {
        console.error('Error deleting diagnosis:', error);
        alert('An error occurred while deleting the diagnosis');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading diagnoses...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md mx-auto mt-6 max-w-xl text-center">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <DiagnosisReport/>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Diagnoses Records</h2>
      {diagnoses.length === 0 ? (
        <div className="text-center text-gray-600">No diagnoses available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diagnoses.map((diagnosis) => (
            <div
              key={diagnosis._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition duration-200"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{diagnosis.condition}</h3>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Details:</span> {diagnosis.diagnosisDetails}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Symptoms:</span> {diagnosis.symptoms?.join(', ') || 'N/A'}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Notes:</span> {diagnosis.notes || 'No additional notes'}
              </p>
              <p className="text-gray-700 mb-3">
                <span className="font-medium">Follow-up:</span>{' '}
                {diagnosis.followUpDate
                  ? new Date(diagnosis.followUpDate).toLocaleDateString()
                  : 'Not scheduled'}
              </p>

              <div className="border-t border-gray-200 pt-3 mt-3 space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-800">Patient:</span> 
                  {diagnosis.patientId?.userId?.firstName ? `${diagnosis.patientId.userId.firstName} ${diagnosis.patientId.userId.lastName}` : 'Unknown'}
                  <br />
                  <span className="text-gray-500">ID:</span> {diagnosis.patientId?._id || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Doctor:</span> 
                  {diagnosis.doctorId?.userId?.firstName ? `${diagnosis.doctorId.userId.firstName} ${diagnosis.doctorId.userId.lastName}` : 'Unknown'}
                  <br />
                  <span className="text-gray-500">ID:</span> {diagnosis.doctorId?._id || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Hospital:</span> 
                  {diagnosis.hospitalId?.name || 'N/A'}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleUpdate(diagnosis._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(diagnosis._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosesDisplay;
