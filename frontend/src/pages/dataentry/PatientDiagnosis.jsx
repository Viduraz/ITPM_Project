import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TESTING_MODE = true; // Set to false when backend is ready

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Component for creating a diagnosis.
 *
 * Handles form submission and API call to create a new diagnosis.
 * Also handles form validation and error messages.
 *
 * @return {JSX.Element} Component JSX
 */
/*******  252fb353-f758-4b90-be7c-1fd84c961878  *******/
const PatientDiagnosis = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    hospitalId: '', // Optional field
    diagnosisDetails: '',
    condition: '',
    symptoms: '', // Treating symptoms as a string to be split later into an array
    notes: '', // Optional
    followUpDate: '', // Optional
    date: '', // This will be removed
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set the initial date on component mount (this will no longer be used)
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setFormData((prevState) => ({
      ...prevState,
      followUpDate: currentDate, // Set follow-up date to today's date by default
    }));

    // If in TESTING_MODE, auto-fill dummy data
    if (TESTING_MODE) {
      setFormData({
        patientId: '1234567890abcdef12345678', // Dummy Patient ID
        doctorId: 'abcdef1234567890abcdef12', // Dummy Doctor ID
        hospitalId: 'abcd1234abcd1234abcd1234', // Dummy Hospital ID (optional)
        diagnosisDetails: 'Migraine caused by stress', // Dummy Diagnosis
        condition: 'Migraine', // Dummy Condition
        symptoms: 'Headache, dizziness, nausea', // Dummy Symptoms (to be split into an array)
        notes: 'Patient is advised to rest and hydrate.', // Dummy Notes (optional)
        followUpDate: '2025-04-20', // Dummy Follow-up Date (optional)
        date: currentDate, // This will be removed
      });

      // Auto-submit the form after a brief delay
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} }); // Trigger form submission
      }, 2000); // Auto-submit after 2 seconds
    }
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
    if (!formData.doctorId) errors.push('Doctor ID is required');
    if (!formData.condition.trim()) errors.push('Condition is required');
    if (!formData.diagnosisDetails.trim()) errors.push('Diagnosis details are required');
    if (!formData.symptoms.trim()) errors.push('Symptoms are required');
    if (!formData.followUpDate) errors.push('Follow-up date is required');

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
        // Reset form except followUpDate
        setFormData({
          patientId: '',
          doctorId: '',
          hospitalId: '',
          diagnosisDetails: '',
          condition: '',
          symptoms: '',
          notes: '',
          followUpDate: new Date().toISOString().split('T')[0], // Keep today's date for follow-up
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

      // Make the API call
      const response = await axios.post(
        'http://localhost:3000/api/diagnosis', // Update this if needed
        formData,
        config
      );

      console.log("API Response:", response.data);
      setSuccessMessage('Diagnosis created successfully');
      
      // Reset form except followUpDate
      setFormData({
        patientId: '',
        doctorId: '',
        hospitalId: '',
        diagnosisDetails: '',
        condition: '',
        symptoms: '',
        notes: '',
        followUpDate: new Date().toISOString().split('T')[0], // Keep today's date for follow-up
      });
    } catch (error) {
      console.error("Error submitting diagnosis:", error);
      const errorMsg = error.response?.data?.message || 'An error occurred while submitting the diagnosis';
      setErrorMessages([errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert symptoms to an array by splitting the input string
  const handleSymptomsChange = (e) => {
    setFormData({
      ...formData,
      symptoms: e.target.value,
    });
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

        {/* Doctor ID */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Doctor ID</label>
          <input
            type="text"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter doctor ID"
            required
          />
        </div>

        {/* Hospital ID (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Hospital ID</label>
          <input
            type="text"
            name="hospitalId"
            value={formData.hospitalId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter hospital ID (optional)"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Condition</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter condition"
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

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Symptoms</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleSymptomsChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Enter symptoms, separated by commas"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="Enter any additional notes"
          />
        </div>

        {/* Follow-up Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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

export default PatientDiagnosis;
