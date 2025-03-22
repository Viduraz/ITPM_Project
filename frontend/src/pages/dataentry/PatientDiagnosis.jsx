import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "../../components/layout/Sidebar";

const PatientDiagnosis = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    symptoms: '',
    diagnosisDetails: '',
    treatmentPlan: '',
    date: '', // Add the date field
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Set the initial date on component mount
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    setFormData((prevState) => ({
      ...prevState,
      date: currentDate, // Set the current date to the 'date' field
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error messages
    setErrorMessages([]);

    // Validate form fields before submission
    let errors = [];
    if (!formData.patientId) errors.push('Patient ID is required');
    if (!formData.symptoms.trim()) errors.push('Symptoms are required');
    if (!formData.diagnosisDetails.trim()) errors.push('Diagnosis details are required');
    if (!formData.treatmentPlan.trim()) errors.push('Treatment Plan details are required');
    if (!formData.date) errors.push('Date is required'); // Validate date

    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const response = await axios.post('/api/diagnosis', formData);

      setSuccessMessage('Diagnosis created successfully');
      setFormData({
        patientId: '',
        symptoms: '',
        diagnosisDetails: '',
        treatmentPlan: '',
        date: '', // Reset date field
      });
    } catch (error) {
      setErrorMessages([error.response?.data?.message || 'An error occurred']);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar - Pass the userRole as "dataentry" */}
      <Sidebar userRole="dataentry" /> {/* Data Entry role */}

      <div className="flex-1 p-6 ml-64"> {/* Main content */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Diagnosis Entry Form</h2>

          {/* Patient ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Patient ID</label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          {/* Diagnosis Details */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Diagnosis Details</label>
            <textarea
              name="diagnosisDetails"
              value={formData.diagnosisDetails}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          {/* Treatment Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Treatment Plan</label>
            <textarea
              name="treatmentPlan"
              value={formData.treatmentPlan}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          {/* Date (auto-filled with current date) */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
              readOnly // Optionally, make the date field read-only to prevent user modification
            />
          </div>

          {/* Error Messages */}
          {errorMessages.length > 0 && (
            <div className="mt-2 text-red-500">
              {errorMessages.map((msg, index) => (
                <p key={index}>{msg}</p>
              ))}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-2 text-green-500">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 p-2 bg-indigo-600 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientDiagnosis;
