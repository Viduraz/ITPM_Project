import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TESTING_MODE = false; // Set to false when backend is ready

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
    status: 'active', // Default value
    purchasedFrom: 'not_purchased', // Default value
    pharmacyDetails: {
      pharmacyId: '',
      purchaseDate: '',
      invoiceNumber: '',
    }
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
  
    // Validate form fields
    let errors = [];
    if (!formData.patient) errors.push('Patient ID is required');
    if (!formData.doctor) errors.push('Doctor ID is required');
    if (!formData.diagnosis) errors.push('Diagnosis ID is required');
    if (!formData.medications || formData.medications.length === 0) errors.push('At least one medication is required');
    if (!formData.medications.every((med) => med.name.trim())) errors.push('Medication name is required for all medications');
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
        setSuccessMessage('Prescription created successfully (Test Mode)');
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
        setIsSubmitting(false);
      }, 1000);
      return; // Skip the actual API call
    }
  
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrorMessages(['You are not authenticated. Please log in first.']);
        setIsSubmitting(false);
        return;
      }
  
      // Setup axios headers with authorization
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
  
      // Make the API call
      const response = await axios.post(
        'http://localhost:3000/api/dataentry/prescriptions',
        formData,
        config
      );
  
      console.log("API Response:", response.data);
      setSuccessMessage('Prescription created successfully');
      
      // Reset form except date
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
    } catch (error) {
      console.error("Error submitting prescription:", error);
      const errorMsg = error.response?.data?.message || 'An error occurred while submitting the prescription';
      setErrorMessages([errorMsg]);
    } finally {
      setIsSubmitting(false);
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

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {/* Patient */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Patient</label>
          <input
            type="text"
            name="patient"
            value={formData.patient}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter patient ID"
            required
          />
        </div>

        {/* Doctor */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Doctor</label>
          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter doctor ID"
            required
          />
        </div>

        {/* Hospital */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Hospital (Optional)</label>
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter hospital ID (optional)"
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter diagnosis ID"
            required
          />
        </div>

        {/* Medications */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Medications</label>
          {formData.medications.map((medication, index) => (
            <div key={index} className="space-y-2 mb-4">
              <input
                type="text"
                name="name"
                value={medication.name}
                onChange={(e) => handleMedicationChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Medication name"
                required
              />
              <input
                type="text"
                name="dosage"
                value={medication.dosage}
                onChange={(e) => handleMedicationChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Dosage"
              />
              <input
                type="text"
                name="frequency"
                value={medication.frequency}
                onChange={(e) => handleMedicationChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Frequency"
              />
              <input
                type="text"
                name="duration"
                value={medication.duration}
                onChange={(e) => handleMedicationChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Duration"
              />
              <textarea
                name="instructions"
                value={medication.instructions}
                onChange={(e) => handleMedicationChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Instructions"
              />
              <button
                type="button"
                onClick={() => handleRemoveMedication(index)}
                className="text-red-500"
              >
                Remove Medication
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMedication}
            className="mt-2 text-blue-500"
          >
            Add Medication
          </button>
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

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Pharmacy Information */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Purchased From</label>
          <select
            name="purchasedFrom"
            value={formData.purchasedFrom}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="not_purchased">Not Purchased</option>
            <option value="hospital_pharmacy">Hospital Pharmacy</option>
            <option value="outside_pharmacy">Outside Pharmacy</option>
          </select>
        </div>

        {/* Pharmacy Details */}
        {formData.purchasedFrom !== 'not_purchased' && (
          <div className="space-y-4">
            <input
              type="text"
              name="pharmacyId"
              value={formData.pharmacyDetails.pharmacyId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pharmacyDetails: {
                    ...formData.pharmacyDetails,
                    pharmacyId: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Pharmacy ID"
            />
            <input
              type="date"
              name="purchaseDate"
              value={formData.pharmacyDetails.purchaseDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pharmacyDetails: {
                    ...formData.pharmacyDetails,
                    purchaseDate: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              name="invoiceNumber"
              value={formData.pharmacyDetails.invoiceNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pharmacyDetails: {
                    ...formData.pharmacyDetails,
                    invoiceNumber: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Invoice Number"
            />
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
            {isSubmitting ? 'Submitting...' : 'Create Prescription'}
          </button>
        </div>
      </form>


    </div>
  );
};

export default PatientPrescription;
