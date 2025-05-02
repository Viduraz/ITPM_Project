import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TESTING_MODE = false;

const PatientPrescription = () => {
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    hospital: '',
    diagnosis: '',
    date: '',
    medications: [{
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    }],
    notes: '',
    status: 'active',
    purchasedFrom: 'not_purchased',
    pharmacyDetails: {
      pharmacyId: '',
      purchaseDate: '',
      invoiceNumber: '',
    }
  });

  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (successMessage) setSuccessMessage('');
  };

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const newMedications = [...formData.medications];
    newMedications[index][name] = value;
    setFormData({
      ...formData,
      medications: newMedications,
    });
  };

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      ],
    });
  };

  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      medications: newMedications,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessages([]);
    
    let errors = [];

    if (!formData.patient) errors.push('Patient ID is required');
    if (!formData.doctor) errors.push('Doctor ID is required');
    if (!formData.diagnosis) errors.push('Diagnosis ID is required');
    if (!formData.date) errors.push('Date is required');
    if (!formData.medications || formData.medications.length === 0) {
      errors.push('At least one medication is required');
    }
    if (!formData.medications.every((med) => med.name.trim())) {
      errors.push('Medication name is required for all medications');
    }

    // Conditionally validate pharmacy fields
    if (formData.purchasedFrom !== 'not_purchased') {
      if (!formData.pharmacyDetails.pharmacyId) {
        errors.push('Pharmacy ID is required');
      }
      if (!formData.pharmacyDetails.purchaseDate) {
        errors.push('Purchase date is required');
      }
      if (!formData.pharmacyDetails.invoiceNumber) {
        errors.push('Invoice number is required');
      }
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      setIsSubmitting(false);
      return;
    }

    if (TESTING_MODE) {
      setTimeout(() => {
        console.log("Form data submitted (TEST MODE):", formData);
        setSuccessMessage('Prescription created successfully (Test Mode)');
        resetForm();
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessages(['You are not authenticated. Please log in first.']);
        setIsSubmitting(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        'http://localhost:3000/api/dataentry/prescriptions',
        formData,
        config
      );

      console.log("API Response:", response.data);
      setSuccessMessage('Prescription created successfully');
      resetForm();
    } catch (error) {
      console.error("Error submitting prescription:", error);
      const errorMsg = error.response?.data?.message || 'An error occurred while submitting the prescription';
      setErrorMessages([errorMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      doctor: '',
      hospital: '',
      diagnosis: '',
      date: new Date().toISOString().split('T')[0],
      medications: [{
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      }],
      notes: '',
      status: 'active',
      purchasedFrom: 'not_purchased',
      pharmacyDetails: {
        pharmacyId: '',
        purchaseDate: '',
        invoiceNumber: '',
      },
    });
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Create Prescription</h2>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 border-l-4 border-green-500 text-green-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {/* Patient, Doctor, Hospital, Diagnosis */}
        {['patient', 'doctor', 'hospital', 'diagnosis'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-600 capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required={field !== 'hospital'}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder={`Enter ${field} ID${field === 'hospital' ? ' (optional)' : ''}`}
            />
          </div>
        ))}

        {/* Medications */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Medications</label>
          {formData.medications.map((med, index) => (
            <div key={index} className="mb-4 space-y-2">
              {['name', 'dosage', 'frequency', 'duration'].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={med[field]}
                  onChange={(e) => handleMedicationChange(index, e)}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required={field === 'name'}
                />
              ))}
              <textarea
                name="instructions"
                value={med.instructions}
                onChange={(e) => handleMedicationChange(index, e)}
                rows="2"
                className="block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Instructions"
              />
              {formData.medications.length > 1 && (
                <button type="button" className="text-red-500" onClick={() => handleRemoveMedication(index)}>
                  Remove Medication
                </button>
              )}
            </div>
          ))}
          <button type="button" className="text-blue-500" onClick={handleAddMedication}>
            Add Medication
          </button>
        </div>

        {/* Notes, Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter any additional notes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Purchased From */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Purchased From</label>
          <select
            name="purchasedFrom"
            value={formData.purchasedFrom}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="not_purchased">Not Purchased</option>
            <option value="hospital_pharmacy">Hospital Pharmacy</option>
            <option value="outside_pharmacy">Outside Pharmacy</option>
          </select>
        </div>

        {/* Conditional Pharmacy Fields */}
        {formData.purchasedFrom !== 'not_purchased' && (
          <div className="space-y-2">
            {['pharmacyId', 'purchaseDate', 'invoiceNumber'].map((field) => (
              <input
                key={field}
                type={field === 'purchaseDate' ? 'date' : 'text'}
                name={field}
                value={formData.pharmacyDetails[field]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pharmacyDetails: {
                      ...formData.pharmacyDetails,
                      [field]: e.target.value,
                    },
                  })
                }
                className="block w-full p-2 border border-gray-300 rounded-md"
                placeholder={field === 'pharmacyId' ? 'Pharmacy ID' : field.replace(/([A-Z])/g, ' $1')}
              />
            ))}
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Errors */}
        {errorMessages.length > 0 && (
          <div className="p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
            <ul className="list-disc pl-5">
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Create Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientPrescription;
