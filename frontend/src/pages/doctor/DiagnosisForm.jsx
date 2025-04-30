// src/pages/doctor/DiagnosisForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TESTING_MODE = true; // Set to false when backend is ready

const DiagnosisForm = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    symptoms: '',
    diagnosisDetails: '',
    treatmentPlan: '',
    date: '',
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set the initial date on component mount
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setFormData((prevState) => ({
      ...prevState,
      date: currentDate,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear success message when form is being edited
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessages([]);

    // Validate form fields
    let errors = [];
    if (!formData.patientId) errors.push('Patient ID is required');
    if (!formData.symptoms.trim()) errors.push('Symptoms are required');
    if (!formData.diagnosisDetails.trim()) errors.push('Diagnosis details are required');
    if (!formData.treatmentPlan.trim()) errors.push('Treatment Plan details are required');
    if (!formData.date) errors.push('Date is required');

    if (errors.length > 0) {
      setErrorMessages(errors);
      setIsSubmitting(false);
      return;
    }

    if (TESTING_MODE) {
      // Simulate successful submission in testing mode
      setTimeout(() => {
        console.log("Form data submitted (TEST MODE):", formData);
        setSuccessMessage('Diagnosis created successfully (Test Mode)');
        // Reset form except date
        setFormData({
          patientId: '',
          symptoms: '',
          diagnosisDetails: '',
          treatmentPlan: '',
          date: new Date().toISOString().split('T')[0],
        });
        setIsSubmitting(false);
      }, 1000);
      return; // Skip the actual API call
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Setup axios headers with authorization
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '' 
        }
      };

      // For testing without backend, uncomment this block and comment out the real API call
      // setTimeout(() => {
      //   console.log("Form data submitted:", formData);
      //   setSuccessMessage('Diagnosis created successfully');
      //   // Reset form except date
      //   setFormData({
      //     patientId: '',
      //     symptoms: '',
      //     diagnosisDetails: '',
      //     treatmentPlan: '',
      //     date: new Date().toISOString().split('T')[0],
      //   });
      //   setIsSubmitting(false);
      // }, 1000);
      
      // Make the API call
      const response = await axios.post(
        'http://localhost:3000/api/diagnosis', // Try this first
        formData,
        config
      );

      console.log("API Response:", response.data);
      setSuccessMessage('Diagnosis created successfully');
      
      // Reset form except date
      setFormData({
        patientId: '',
        symptoms: '',
        diagnosisDetails: '',
        treatmentPlan: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
      const errorMsg = error.response?.data?.message || 'An error occurred while submitting the diagnosis';
      setErrorMessages([errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Create Diagnosis</h2>
      
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {/* Patient ID */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter patient ID"
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
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Describe patient symptoms"
            required
          />
        </div>

        {/* Diagnosis Details */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Diagnosis Details</label>
          <textarea
            name="diagnosisDetails"
            value={formData.diagnosisDetails}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Enter diagnosis details"
            required
          />
        </div>

        {/* Treatment Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Treatment Plan</label>
          <textarea
            name="treatmentPlan"
            value={formData.treatmentPlan}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Describe treatment plan"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Error Messages */}
        {errorMessages.length > 0 && (
          <div className="p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
            <ul className="list-disc pl-5">
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isSubmitting ? 'Submitting...' : 'Create Diagnosis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosisForm;