import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiagnosisList = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/diagnoses');
        setDiagnoses(response.data.diagnoses); // Assuming the response has a 'diagnoses' field
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        setErrorMessages(['Failed to fetch diagnoses']);
      }
    };

    fetchDiagnoses();
  }, []);

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Diagnoses List</h2>

      {/* Error Messages */}
      {errorMessages.length > 0 && (
        <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
          <ul className="list-disc pl-5">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Diagnoses Table */}
      {diagnoses.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border-b">Patient</th>
              <th className="py-3 px-6 border-b">Doctor</th>
              <th className="py-3 px-6 border-b">Condition</th>
              <th className="py-3 px-6 border-b">Follow-up Date</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map((diagnosis) => (
              <tr key={diagnosis._id}>
                <td className="py-3 px-6 border-b">{diagnosis.patientId?.name}</td>
                <td className="py-3 px-6 border-b">{diagnosis.doctorId?.name}</td>
                <td className="py-3 px-6 border-b">{diagnosis.condition}</td>
                <td className="py-3 px-6 border-b">{new Date(diagnosis.followUpDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 text-gray-600">No diagnoses found.</p>
      )}
    </div>
  );
};

export default DiagnosisList;
