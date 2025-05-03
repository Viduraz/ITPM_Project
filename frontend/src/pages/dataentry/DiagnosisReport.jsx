import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DiagnosisReport = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

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
        setFilteredDiagnoses(response.data);
      } catch (error) {
        console.error('Error fetching diagnoses:', error);
        setErrorMessage('An error occurred while fetching diagnoses.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  // Filter by condition
  const handleConditionFilter = (text) => {
    setConditionFilter(text);
    if (text) {
      setFilteredDiagnoses(
        diagnoses.filter((diagnosis) =>
          diagnosis.condition?.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFilteredDiagnoses(diagnoses);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredDiagnoses.map((diagnosis) => ({
      'Patient Name': `${diagnosis.patientId?.userId?.firstName || ''} ${diagnosis.patientId?.userId?.lastName || ''}`,
      'Condition': diagnosis.condition,
      'Symptoms': diagnosis.symptoms?.join(', ') || 'N/A',
      'Follow-up Date': diagnosis.followUpDate
        ? new Date(diagnosis.followUpDate).toLocaleDateString()
        : 'Not scheduled',
      'Doctor': `${diagnosis.doctorId?.userId?.firstName || ''} ${diagnosis.doctorId?.userId?.lastName || ''}`,
      'Hospital': diagnosis.hospitalId?.name || 'N/A',
    }));

    const headers = Object.keys(csvData[0]);
    const rows = csvData.map(row => headers.map(header => row[header]));

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'diagnosis_report.csv';
    link.click();
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Diagnosis Report', 14, 20);

    const tableColumn = [
      'Patient Name',
      'Condition',
      'Symptoms',
      'Follow-up',
      'Doctor',
      'Hospital',
    ];

    const tableRows = filteredDiagnoses.map(diagnosis => [
      `${diagnosis.patientId?.userId?.firstName || ''} ${diagnosis.patientId?.userId?.lastName || ''}`,
      diagnosis.condition || '',
      diagnosis.symptoms?.join(', ') || 'N/A',
      diagnosis.followUpDate
        ? new Date(diagnosis.followUpDate).toLocaleDateString()
        : 'Not scheduled',
      `${diagnosis.doctorId?.userId?.firstName || ''} ${diagnosis.doctorId?.userId?.lastName || ''}`,
      diagnosis.hospitalId?.name || 'N/A',
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('diagnosis_report.pdf');
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Loading diagnoses...</p>
      </div>
    );
  }

  // Error
  if (errorMessage) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md mx-auto mt-6 max-w-xl text-center">
        <p>{errorMessage}</p>
      </div>
    );
  }

  // UI
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Diagnosis Report</h2>

      {/* Filter input and All button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder="Filter by condition..."
          value={conditionFilter}
          onChange={(e) => handleConditionFilter(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-80"
        />
        <button
          onClick={() => handleConditionFilter('')}
          className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          Show All
        </button>
      </div>

      {/* Export Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={exportToCSV}
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          Export to CSV
        </button>
        <button
          onClick={exportToPDF}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          Export to PDF
        </button>
      </div>

      {/* Diagnoses list */}
      {filteredDiagnoses.length === 0 ? (
        <div className="text-center text-gray-600">No diagnoses match the filter.</div>
      ) : (
        <div className="space-y-6">
          {filteredDiagnoses.map((diagnosis) => (
            <div
              key={diagnosis._id}
              className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{diagnosis.condition}</h3>
              <p><strong>Details:</strong> {diagnosis.diagnosisDetails}</p>
              <p><strong>Symptoms:</strong> {diagnosis.symptoms?.join(', ') || 'N/A'}</p>
              <p><strong>Notes:</strong> {diagnosis.notes || 'No additional notes'}</p>
              <p><strong>Follow-up:</strong> {diagnosis.followUpDate ? new Date(diagnosis.followUpDate).toLocaleDateString() : 'Not scheduled'}</p>
              <div className="mt-4 text-sm text-gray-700">
                <p><strong>Patient:</strong> {diagnosis.patientId?.userId?.firstName || 'Unknown'} {diagnosis.patientId?.userId?.lastName || ''}</p>
                <p><strong>Doctor:</strong> {diagnosis.doctorId?.userId?.firstName || 'Unknown'} {diagnosis.doctorId?.userId?.lastName || ''}</p>
                <p><strong>Hospital:</strong> {diagnosis.hospitalId?.name || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosisReport;
