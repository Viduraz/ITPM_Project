import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileDownload, FaFileCsv, FaFilePdf, FaSearch, FaSyncAlt, FaHospital, FaUserMd, FaUser } from 'react-icons/fa';

const DiagnosisReport = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Fetch diagnoses with error handling and retry mechanism
  useEffect(() => {
    const fetchDiagnoses = async (retryCount = 0) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found');

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              Diagnosis Reports
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by condition..."
                  value={conditionFilter}
                  onChange={(e) => handleConditionFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaFileDownload />
                  Export Options
                </button>
                {showExportOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <button
                      onClick={exportToCSV}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaFileCsv className="text-green-600" />
                      Export to CSV
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaFilePdf className="text-red-600" />
                      Export to PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : errorMessage ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDiagnoses.map((diagnosis) => (
                <div
                  key={diagnosis._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisReport;
