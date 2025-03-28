import React, { useState } from "react";

const PatientPrescription = () => {
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "" }],
    status: "active",
    notes: "",
  });

  const [errors, setErrors] = useState({
    patient: "",
    doctor: "",
    diagnosis: "",
    medications: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const medications = [...formData.medications];
    medications[index][name] = value;
    setFormData({ ...formData, medications });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: "", dosage: "", frequency: "" }],
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient) newErrors.patient = "Patient ID is required";
    if (!formData.doctor) newErrors.doctor = "Doctor ID is required";
    if (!formData.diagnosis) newErrors.diagnosis = "Diagnosis ID is required";
    if (!formData.medications.some((med) => med.name)) newErrors.medications = "At least one medication is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data submitted:", formData);
      // Handle form submission here (e.g., send data to the server)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Patient Prescription Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Patient */}
          <div className="mb-4">
            <label htmlFor="patient" className="block text-gray-700">Patient ID</label>
            <input
              type="text"
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Patient ID"
            />
            {errors.patient && <span className="text-red-500 text-sm">{errors.patient}</span>}
          </div>

          {/* Doctor */}
          <div className="mb-4">
            <label htmlFor="doctor" className="block text-gray-700">Doctor ID</label>
            <input
              type="text"
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Doctor ID"
            />
            {errors.doctor && <span className="text-red-500 text-sm">{errors.doctor}</span>}
          </div>

          {/* Diagnosis */}
          <div className="mb-4">
            <label htmlFor="diagnosis" className="block text-gray-700">Diagnosis ID</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Diagnosis ID"
            />
            {errors.diagnosis && <span className="text-red-500 text-sm">{errors.diagnosis}</span>}
          </div>

          {/* Medications */}
          <div className="mb-4">
            <label htmlFor="medications" className="block text-gray-700">Medications</label>
            <div className="space-y-2" id="medications">
              {formData.medications.map((med, index) => (
                <div key={index} className="flex space-x-4">
                  <input
                    type="text"
                    name="name"
                    value={med.name}
                    onChange={(e) => handleMedicationChange(index, e)}
                    placeholder="Medication Name"
                    className="p-2 border border-gray-300 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="dosage"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, e)}
                    placeholder="Dosage"
                    className="p-2 border border-gray-300 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="frequency"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(index, e)}
                    placeholder="Frequency"
                    className="p-2 border border-gray-300 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            {errors.medications && <span className="text-red-500 text-sm">{errors.medications}</span>}
            <button type="button" onClick={addMedication} className="text-blue-500 mt-2">Add Another Medication</button>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label htmlFor="notes" className="block text-gray-700">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Submit Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientPrescription;
