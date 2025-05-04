import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import {
  FaFileDownload,
  FaFileCsv,
  FaFilePdf,
  FaSearch,
  FaHospital
} from 'react-icons/fa';

const DiagnosisReport = ({ diagnoses, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState(diagnoses);

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

  const exportToCSV = () => {
    try {
      if (diagnoses.length === 0) {
        alert('No data to export');
        return;
      }

      const headers = ['Patient Name', 'Condition', 'Symptoms', 'Follow-up Date', 'Doctor', 'Hospital'];
      const rows = filteredDiagnoses.map(diagnosis => [
        `${diagnosis.patientId?.userId?.firstName || ''} ${diagnosis.patientId?.userId?.lastName || ''}`.trim() || 'N/A',
        diagnosis.condition || 'N/A',
        diagnosis.symptoms?.join('; ') || 'N/A',
        diagnosis.followUpDate ? new Date(diagnosis.followUpDate).toLocaleDateString() : 'Not scheduled',
        `${diagnosis.doctorId?.userId?.firstName || ''} ${diagnosis.doctorId?.userId?.lastName || ''}`.trim() || 'N/A',
        diagnosis.hospitalId?.name || 'N/A'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `diagnosis_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Failed to generate CSV. Please try again.');
    }
  };

  const exportToPDF = () => {
    try {
      if (diagnoses.length === 0) {
        alert('No data to export');
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('Hospital Management System', 105, 15, { align: 'center' });

      doc.setFontSize(16);
      doc.text('Diagnosis Report', 105, 25, { align: 'center' });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 35, { align: 'center' });

      const tableColumn = ['Patient Name', 'Condition', 'Symptoms', 'Follow-up Date', 'Doctor', 'Hospital'];
      const tableRows = filteredDiagnoses.map(diagnosis => [
        `${diagnosis.patientId?.userId?.firstName || ''} ${diagnosis.patientId?.userId?.lastName || ''}`.trim() || 'N/A',
        diagnosis.condition || 'N/A',
        diagnosis.symptoms?.join(', ') || 'N/A',
        diagnosis.followUpDate ? new Date(diagnosis.followUpDate).toLocaleDateString() : 'Not scheduled',
        `${diagnosis.doctorId?.userId?.firstName || ''} ${diagnosis.doctorId?.userId?.lastName || ''}`.trim() || 'N/A',
        diagnosis.hospitalId?.name || 'N/A'
      ]);

      autoTable(doc, {
        startY: 45,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        tableWidth: 'wrap', // Ensure it fits A4 width
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 45 }
      });

      doc.save(`diagnosis_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Diagnosis Reports</h1>
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
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredDiagnoses.map((diagnosis) => (
                <div
                  key={diagnosis._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 max-w-sm"
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-blue-600 truncate max-w-[150px]">{diagnosis.condition}</h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                        {new Date(diagnosis.followUpDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="text-gray-600 line-clamp-2">{diagnosis.diagnosisDetails}</p>
                      <div className="flex items-center text-gray-500">
                        <FaHospital className="mr-1 text-xs flex-shrink-0" />
                        <span className="truncate">{diagnosis.hospitalId?.name || 'N/A'}</span>
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
