import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiagnosisReport = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');

  // Fetch diagnoses data from API
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
        setFilteredDiagnoses(response.data); // Initially show all diagnoses
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        setErrorMessage('An error occurred while fetching diagnoses.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  // Handle filter change
  const handleSymptomFilter = (symptom) => {
    setSelectedSymptom(symptom);
    if (symptom) {
      setFilteredDiagnoses(
        diagnoses.filter((diagnosis) =>
          diagnosis.symptoms?.some((s) => s.toLowerCase().includes(symptom.toLowerCase()))
        )
      );
    } else {
      setFilteredDiagnoses(diagnoses);
    }
  };

  // Export filtered diagnoses as CSV
  const exportToCSV = () => {
    const csvData = filteredDiagnoses.map((diagnosis) => {
      return {
        'Patient ID': diagnosis.patientId?._id || 'N/A',
        'Patient Name': `${diagnosis.patientId?.userId?.firstName || 'Unknown'} ${diagnosis.patientId?.userId?.lastName || ''}`,
        'Condition': diagnosis.condition,
        'Diagnosis Details': diagnosis.diagnosisDetails,
        'Symptoms': diagnosis.symptoms?.join(', ') || 'N/A',
        'Follow-up Date': diagnosis.followUpDate
          ? new Date(diagnosis.followUpDate).toLocaleDateString()
          : 'Not scheduled',
        'Doctor': `${diagnosis.doctorId?.userId?.firstName || 'Unknown'} ${diagnosis.doctorId?.userId?.lastName || ''}`,
        'Hospital': diagnosis.hospitalId?.name || 'N/A',
      };
    });

    const csvRows = [];
    const headers = Object.keys(csvData[0]);
    csvRows.push(headers.join(','));

    csvData.forEach((row) => {
      const values = headers.map((header) => row[header]);
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'diagnosis_report.csv';
    link.click();
  };

  // Display loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading diagnoses...</p>
      </div>
    );
  }

  // Display error message
  if (errorMessage) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md mx-auto mt-6 max-w-xl text-center">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Diagnosis Report</h2>

      <div className="mb-6">
        <button
          onClick={() => handleSymptomFilter('cough')}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg mr-4"
        >
          Cough
        </button>
        <button
          onClick={() => handleSymptomFilter('fever')}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg mr-4"
        >
          Fever
        </button>
        <button
          onClick={() => handleSymptomFilter('animal bite')}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          Animal Bite
        </button>
        <button
          onClick={() => handleSymptomFilter('')}
          className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg ml-4"
        >
          Show All
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={exportToCSV}
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          Export to CSV
        </button>
      </div>

      {filteredDiagnoses.length === 0 ? (
        <div className="text-center text-gray-600">No diagnoses available for the selected symptom.</div>
      ) : (
        <div className="space-y-6">
          {filteredDiagnoses.map((diagnosis) => (
            <div
              key={diagnosis._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
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
                  <span className="font-semibold text-gray-800">Patient:</span>{' '}
                  {diagnosis.patientId?.userId?.firstName || 'Unknown'}{' '}
                  {diagnosis.patientId?.userId?.lastName || ''}
                  <br />
                  <span className="text-gray-500">ID:</span> {diagnosis.patientId?._id || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Doctor:</span>{' '}
                  {diagnosis.doctorId?.userId?.firstName || 'Unknown'}{' '}
                  {diagnosis.doctorId?.userId?.lastName || ''}
                  <br />
                  <span className="text-gray-500">ID:</span> {diagnosis.doctorId?._id || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Hospital:</span>{' '}
                  {diagnosis.hospitalId?.name || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosisReport;
