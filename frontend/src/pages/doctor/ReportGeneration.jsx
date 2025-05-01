import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowLeft, FaFilePdf, FaUserInjured, FaFlask, FaPrescription, FaChartBar } from 'react-icons/fa';
import axios from 'axios';

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

  // Sample patient data (remove in production)
  const mockData = [
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
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!disease) {
      alert('Please select a disease');
      return;
    }
    
    setLoading(true);
    
    try {
      // For demo purposes, we'll use mock data
      // In production, replace this with an actual API call
      setTimeout(() => {
        setPatients(mockData);
        setShowResults(true);
        setLoading(false);
      }, 1000);
      
      /* Uncomment for real API usage
      const response = await axios.get('http://localhost:3000/api/doctors/reports/disease', {
        params: {
          reportType,
          diseaseId: disease,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setPatients(response.data.patients || []);
      setShowResults(true);
      */
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    alert('PDF Report downloaded successfully!');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
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
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
              dateFormat="MMMM d, yyyy"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
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

  // Results component
  const ReportResults = () => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {diseases.find(d => d.id === disease)?.name} Patient Report
        </h2>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaFilePdf className="mr-2" />
          Download PDF
        </button>
      </div>
      
      <div className="flex justify-between text-gray-600 text-sm mb-6">
        <p>Report Type: <span className="font-medium">{reportType.charAt(0).toUpperCase() + reportType.slice(1)}</span></p>
        <p>Period: <span className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</span></p>
      </div>
      
      {patients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No patients found with this disease during the selected period.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6">
        <button
          onClick={() => setShowResults(false)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center"
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

