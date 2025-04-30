// src/pages/doctor/PrescriptionForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const PrescriptionForm = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    medication: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    let newErrors = {};
    
    if (!formData.patientId) {
      newErrors.patientId = "Patient ID is required.";
    }
    
    if (formData.patientName.length < 3) {
      newErrors.patientName = "Patient name must be at least 3 characters.";
    }
    
    if (formData.medication.length < 2) {
      newErrors.medication = "Medication name must be at least 2 characters.";
    }
    
    if (!formData.dosage) {
      newErrors.dosage = "Dosage is required.";
    }
    
    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required.";
    }
    
    // Calculate current date at midnight for date comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      if (startDate < today) {
        newErrors.startDate = "Start date cannot be in the past.";
      }
    } else {
      newErrors.startDate = "Start date is required.";
    }
    
    if (formData.endDate && formData.startDate) {
      const endDate = new Date(formData.endDate);
      const startDate = new Date(formData.startDate);
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date.";
      }
    } else if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    }
    
    if (formData.notes.length > 200) {
      newErrors.notes = "Notes must be under 200 characters.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear success message on form change
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // You can uncomment this when backend is ready
        // const response = await axios.post('/api/prescriptions', formData);
        
        // For now, just simulate successful submission
        console.log("Prescription data to submit:", formData);
        setSuccessMessage('Prescription created successfully!');
        
        // Reset form
        setFormData({
          patientId: '',
          patientName: '',
          medication: '',
          dosage: '',
          frequency: '',
          startDate: '',
          endDate: '',
          notes: '',
        });
        
        setErrors({});
      } catch (error) {
        console.error("Error submitting prescription:", error);
        setErrors({ 
          submit: error.response?.data?.message || "Failed to submit prescription. Please try again."
        });
      }
    }
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Create Prescription</h2>
      
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>{successMessage}</p>
        </div>
      )}
      
      {errors.submit && (
        <div className="mb-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{errors.submit}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-600">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter patient ID"
          />
          {errors.patientId && <p className="text-red-500 text-sm">{errors.patientId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter patient name"
          />
          {errors.patientName && <p className="text-red-500 text-sm">{errors.patientName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Medication</label>
          <input
            type="text"
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter medication name"
          />
          {errors.medication && <p className="text-red-500 text-sm">{errors.medication}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter dosage"
          />
          {errors.dosage && <p className="text-red-500 text-sm">{errors.dosage}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Frequency</label>
          <input
            type="text"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter frequency"
          />
          {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter any notes"
            maxLength="200"
          />
          {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;