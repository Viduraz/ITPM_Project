// src/pages/patient/MedicalHistory.jsx
import React, { useState, useEffect } from 'react';
import { FaFileMedical, FaPills, FaFlask } from 'react-icons/fa';
import axios from 'axios';

const MedicalHistory = () => {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/patient/medical-history');
        setMedicalHistory(response.data.medicalHistory);
      } catch (err) {
        console.error('Error fetching medical history:', err);
        setError('Failed to load medical history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Medical History</h2>

      {/* Diagnoses Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaFileMedical className="text-indigo-600" /> Diagnoses
        </h3>
        {medicalHistory?.diagnoses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicalHistory.diagnoses.map((diagnosis) => (
              <div key={diagnosis._id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-indigo-500">
                <h4 className="text-lg font-semibold text-gray-800">{diagnosis.condition}</h4>
                <p className="text-sm text-gray-600">Date: {new Date(diagnosis.diagnosisDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Doctor: {diagnosis.doctor?.userId?.firstName} {diagnosis.doctor?.userId?.lastName}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No diagnoses found.</p>
        )}
      </div>

      {/* Prescriptions Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaPills className="text-green-600" /> Prescriptions
        </h3>
        {medicalHistory?.prescriptions?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicalHistory.prescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
                <h4 className="text-lg font-semibold text-gray-800">Medication: {prescription.medications?.map(med => med.name).join(', ')}</h4>
                <p className="text-sm text-gray-600">Instructions: {prescription.instructions}</p>
                <p className="text-sm text-gray-600">Date: {new Date(prescription.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No prescriptions found.</p>
        )}
      </div>

      {/* Lab Results Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaFlask className="text-blue-600" /> Lab Results
        </h3>
        {medicalHistory?.labReports?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicalHistory.labReports.map((lab) => (
              <div key={lab._id} className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
                <h4 className="text-lg font-semibold text-gray-800">{lab.testName}</h4>
                <p className="text-sm text-gray-600">Date: {new Date(lab.testDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Status: {lab.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No lab results found.</p>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;