import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-100 text-red-700 p-4 m-4 rounded-md">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Diagnoses</h2>
      {diagnoses.length === 0 ? (
        <div className="text-center text-gray-600">No diagnoses available.</div>
      ) : (
        <ul className="space-y-6">
          {diagnoses.map((diagnosis) => (
            <li
              key={diagnosis._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800">{diagnosis.condition}</h3>
              <p className="text-gray-600 mt-2">
                <strong>Diagnosis Details:</strong> {diagnosis.diagnosisDetails}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Symptoms:</strong> {diagnosis.symptoms?.join(', ') || 'N/A'}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Notes:</strong> {diagnosis.notes || 'No additional notes'}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Follow-up Date:</strong>{' '}
                {diagnosis.followUpDate
                  ? new Date(diagnosis.followUpDate).toLocaleDateString()
                  : 'Not scheduled'}
              </p>

              <div className="mt-4">
                <p>
                  <strong>Patient Name:</strong>{' '}
                  {diagnosis.patientId?.userId?.firstName || 'Unknown'}{' '}
                  {diagnosis.patientId?.userId?.lastName || ''}
                </p>
                <p>
                  <strong>Doctor Name:</strong>{' '}
                  {diagnosis.doctorId?.userId?.firstName || 'Unknown'}{' '}
                  {diagnosis.doctorId?.userId?.lastName || ''}
                </p>
                <p>
                  <strong>Hospital:</strong>{' '}
                  {diagnosis.hospitalId?.name || 'N/A'}
                </p>
              </div>

              <div className="mt-6 space-x-4">
                <button
                  onClick={() => handleUpdate(diagnosis._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(diagnosis._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DiagnosesDisplay;
