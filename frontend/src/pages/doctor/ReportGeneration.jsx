import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowLeft, FaFilePdf, FaUserInjured, FaFlask, FaPrescription, FaChartBar } from 'react-icons/fa';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BASE_URL = 'http://localhost:5000'; // Adjust according to your backend URL

const ReportGeneration = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('diagnosis');
  const [disease, setDisease] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Predefined list of common diseases for selection
  const diseases = [
    { id: 'covid19', name: 'COVID-19' },
    { id: 'diabetes', name: 'Diabetes Mellitus' },
    { id: 'hypertension', name: 'Hypertension' },
    { id: 'asthma', name: 'Asthma' },
    { id: 'arthritis', name: 'Arthritis' },
    { id: 'cancer', name: 'Cancer' },
    { id: 'depression', name: 'Depression' },
    { id: 'heartDisease', name: 'Heart Disease' },
    { id: 'obesity', name: 'Obesity' },
    { id: 'influenza', name: 'Influenza' },
    { id: 'pneumonia', name: 'Pneumonia' },
    { id: 'gastritis', name: 'Gastritis' },
    { id: 'thyroid', name: 'Thyroid Disorders' }
  ];

  // Mock data for different report types
  const mockDataByType = {
    diagnosis: [
      {
        id: '1',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        diagnosisDate: '2023-03-15',
        severity: 'Moderate',
        treatment: 'Medication A, Rest',
        status: 'Recovering'
      },
      {
        id: '2',
        name: 'Mary Johnson',
        age: 62,
        gender: 'Female',
        diagnosisDate: '2023-02-28',
        severity: 'Severe',
        treatment: 'Hospitalization, Medication B',
        status: 'Under Treatment'
      },
      {
        id: '3',
        name: 'David Lee',
        age: 34,
        gender: 'Male',
        diagnosisDate: '2023-04-05',
        severity: 'Mild',
        treatment: 'Medication C',
        status: 'Recovered'
      }
    ],
    lab: [
      {
        id: '1',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        testType: 'Blood Test',
        testDate: '2023-03-17',
        results: 'Abnormal white blood cell count',
        status: 'Complete'
      },
      {
        id: '2',
        name: 'Mary Johnson',
        age: 62,
        gender: 'Female',
        testType: 'X-Ray',
        testDate: '2023-03-01',
        results: 'Signs of inflammation in lungs',
        status: 'Complete'
      },
      {
        id: '3',
        name: 'Sarah Williams',
        age: 29,
        gender: 'Female',
        testType: 'Blood Test',
        testDate: '2023-04-08',
        results: 'Normal results',
        status: 'Complete'
      }
    ],
    treatment: [
      {
        id: '1',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        treatmentDate: '2023-03-18',
        medications: 'Azithromycin, Paracetamol',
        duration: '7 days',
        status: 'Active'
      },
      {
        id: '2',
        name: 'Mary Johnson',
        age: 62,
        gender: 'Female',
        treatmentDate: '2023-03-02',
        medications: 'Prednisone, Salbutamol',
        duration: '14 days',
        status: 'Completed'
      },
      {
        id: '3',
        name: 'David Lee',
        age: 34,
        gender: 'Male',
        treatmentDate: '2023-04-05',
        medications: 'Ibuprofen',
        duration: '5 days',
        status: 'Active'
      }
    ]
  };

  // Format appropriate endpoint based on report type
  const getEndpointForReportType = () => {
    switch(reportType) {
      case 'diagnosis':
        return '/api/doctors/reports/diagnosis';
      case 'lab':
        return '/api/doctors/reports/lab-tests';
      case 'treatment':
        return '/api/doctors/reports/treatments';
      default:
        return '/api/doctors/reports/diagnosis';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!disease) {
      alert('Please select a disease');
      return;
    }
    
    setLoading(true);
    
    try {
      // Real API implementation
      const endpoint = getEndpointForReportType();
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          diseaseId: disease, // Send disease ID for filtering
          condition: diseases.find(d => d.id === disease)?.name, // Send disease name
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Process response based on your backend structure
      if (response.data && response.data.success) {
        setPatients(response.data.results || []);
        setShowResults(true);
      } else {
        // Fallback to mock data for demo/testing
        console.log('Using mock data');
        setPatients(mockDataByType[reportType] || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      
      // Fallback to mock data for demo/testing
      console.log('Using mock data due to error');
      setPatients(mockDataByType[reportType] || []);
      setShowResults(true);
      
      // In production, uncomment this and remove mock data fallback
      // alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    try {
      // Create new jsPDF instance with portrait orientation
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Get disease name and format date range
      const diseaseName = diseases.find(d => d.id === disease)?.name || 'Unknown';
      const dateStr = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      const title = `${diseaseName} ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
      
      // Add hospital header - using safer positioning
      doc.setFontSize(18);
      doc.text('Central Hospital', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('123 Medical Avenue, Colombo, Sri Lanka', 105, 30, { align: 'center' });
      doc.text('Tel: +94 11 2345678', 105, 35, { align: 'center' });
      
      // Add report title with safe positioning
      doc.setFontSize(16);
      doc.text(title, 105, 45, { align: 'center' });
      
      // Add report period with increased spacing
      doc.setFontSize(11);
      doc.text(`Period: ${dateStr}`, 105, 55, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 60, { align: 'center' });
      
      // Create table columns and rows based on report type
      let columns = [];
      let rows = [];
      
      switch(reportType) {
        case 'diagnosis':
          columns = ['Patient Name', 'Age', 'Gender', 'Diagnosis Date', 'Severity', 'Status'];
          rows = patients.map(p => [
            p.name || 'N/A', 
            p.age?.toString() || 'N/A', 
            p.gender || 'N/A', 
            formatDate(p.diagnosisDate) || 'N/A', 
            p.severity || 'N/A', 
            p.status || 'N/A'
          ]);
          break;
          
        case 'lab':
          columns = ['Patient ID', 'Patient Name', 'Age', 'Gender', 'Test Type', 'Test Date', 'Results', 'Status'];
          rows = patients.map(p => [
            p.id?.toString() || 'N/A',
            p.name || 'N/A', 
            p.age?.toString() || 'N/A', 
            p.gender || 'N/A', 
            p.testType || 'N/A', 
            formatDate(p.testDate) || 'N/A', 
            p.results || 'N/A', 
            p.status || 'N/A'
          ]);
          break;
          
        case 'treatment':
          columns = ['Patient Name', 'Age', 'Gender', 'Date', 'Medications', 'Duration', 'Status'];
          rows = patients.map(p => [
            p.name || 'N/A', 
            p.age?.toString() || 'N/A', 
            p.gender || 'N/A', 
            formatDate(p.treatmentDate) || 'N/A', 
            p.medications || 'N/A', 
            p.duration || 'N/A', 
            p.status || 'N/A'
          ]);
          break;
      }
      
      // Set proper table configuration - safer settings
      doc.autoTable({
        startY: 70,
        head: [columns],
        body: rows,
        theme: 'grid',
        headStyles: {
          fillColor: [63, 81, 181],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 25 }, // First column (name)
          // Make room for longer content
          ...(reportType === 'lab' ? { 6: { cellWidth: 40 } } : {}), // Results column for lab reports
          ...(reportType === 'treatment' ? { 4: { cellWidth: 35 } } : {}) // Medications column for treatments
        }
      });
      
      // Add summary at a safe distance from the table
      const finalY = (doc.autoTable.previous?.finalY || 150) + 10;
      
      // Only add content if there's room on the page, otherwise add a new page
      if (finalY > 250) {
        doc.addPage();
        doc.setFontSize(11);
        doc.text(`Total patients: ${patients.length}`, 20, 20);
        
        if (diseaseName && patients.length > 0) {
          doc.text(`Disease: ${diseaseName}`, 20, 30);
        }
      } else {
        doc.setFontSize(11);
        doc.text(`Total patients: ${patients.length}`, 20, finalY);
        
        if (diseaseName && patients.length > 0) {
          doc.text(`Disease: ${diseaseName}`, 20, finalY + 10);
        }
      }
      
      // Add footer on each page
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          'This is an automatically generated report. Please do not modify.',
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 5,
          { align: 'center' }
        );
      }
      
      // Save the PDF with proper error handling
      const fileName = `${reportType}_${disease}_${formatDateForFileName(startDate)}_${formatDateForFileName(endDate)}.pdf`;
      doc.save(fileName);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
      return false;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateForFileName = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Form component
  const ReportForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-4">Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setReportType('diagnosis')}
              className={`p-4 border rounded-lg flex flex-col items-center ${
                reportType === 'diagnosis' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <FaUserInjured className={`text-2xl mb-2 ${reportType === 'diagnosis' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={reportType === 'diagnosis' ? 'font-medium text-blue-600' : 'text-gray-600'}>
                Diagnosis Report
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setReportType('lab')}
              className={`p-4 border rounded-lg flex flex-col items-center ${
                reportType === 'lab' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <FaFlask className={`text-2xl mb-2 ${reportType === 'lab' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={reportType === 'lab' ? 'font-medium text-blue-600' : 'text-gray-600'}>
                Lab Report
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setReportType('treatment')}
              className={`p-4 border rounded-lg flex flex-col items-center ${
                reportType === 'treatment' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <FaPrescription className={`text-2xl mb-2 ${reportType === 'treatment' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={reportType === 'treatment' ? 'font-medium text-blue-600' : 'text-gray-600'}>
                Treatment Report
              </span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="disease" className="block text-sm font-medium text-gray-700">
            Select Disease
          </label>
          <select
            id="disease"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a disease</option>
            {diseases.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              dateFormat="MMMM d, yyyy"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FaFilePdf className="mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Render different table headers and rows based on report type
  const renderTableHeaders = () => {
    switch(reportType) {
      case 'diagnosis':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        );
      case 'lab':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Results</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        );
      case 'treatment':
        return (
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medications</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    switch(reportType) {
      case 'diagnosis':
        return patients.map((patient) => (
          <tr key={patient.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{patient.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.age}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.gender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(patient.diagnosisDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                patient.severity === 'Severe' ? 'bg-red-100 text-red-800' : 
                patient.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {patient.severity}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.status}
            </td>
          </tr>
        ));
      case 'lab':
        return patients.map((patient) => (
          <tr key={patient.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{patient.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.age}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.gender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.testType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(patient.testDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.results}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${patient.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
              >
                {patient.status}
              </span>
            </td>
          </tr>
        ));
      case 'treatment':
        return patients.map((patient) => (
          <tr key={patient.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{patient.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.age}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.gender}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {formatDate(patient.treatmentDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.medications}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {patient.duration}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${patient.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
              >
                {patient.status}
              </span>
            </td>
          </tr>
        ));
      default:
        return null;
    }
  };

  // Results component
  const ReportResults = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">
          {diseases.find(d => d.id === disease)?.name} {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          <span className="text-sm text-gray-500 ml-2">ID: {disease}</span>
        </h2>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaFilePdf className="mr-2" />
          Download PDF
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between text-gray-600 text-sm mb-6">
        <p>Report Type: <span className="font-medium">{reportType.charAt(0).toUpperCase() + reportType.slice(1)}</span></p>
        <p>Period: <span className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</span></p>
      </div>
      
      {patients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No patients found with {diseases.find(d => d.id === disease)?.name} during the selected period.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {renderTableHeaders()}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableRows()}
            </tbody>
          </table>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-md font-medium text-gray-700 mb-2">Summary</h3>
            <p className="text-gray-600 text-sm">
              Total patients: <span className="font-medium">{patients.length}</span>
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Report generated on: <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <button
          onClick={() => setShowResults(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-50"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/doctor/dashboard')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Disease Report Generation</h1>
        </div>
        
        {showResults ? <ReportResults /> : <ReportForm />}
      </div>
    </div>
  );
};

export default ReportGeneration;

