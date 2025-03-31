import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the validation schema
const schema = yup.object().shape({
  doctor: yup.string().required("Doctor ID is required"),
  hospital: yup.string().optional(),
  diagnosisDetails: yup.string().required("Diagnosis details are required"),
  condition: yup.string().required("Condition is required"),
  symptoms: yup.string().optional(),
  notes: yup.string().optional(),
  followUpDate: yup.date().optional(),
});

const PatientDiagnosis = () => {
  const [patientList, setPatientList] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientNameSearch, setPatientNameSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Function to fetch patients based on the search query
  const fetchPatients = async (searchQuery) => {
    try {
      const response = await fetch(`/api/patients?searchQuery=${searchQuery}`);
      const data = await response.json();

      if (data.patients) {
        setPatientList(data.patients);
      }
    } catch (error) {
      toast.error("Failed to fetch patient data.");
    }
  };

  // Trigger API call when patient name changes
  useEffect(() => {
    if (patientNameSearch.length > 2) {
      fetchPatients(patientNameSearch);
    } else {
      setPatientList([]);
    }
  }, [patientNameSearch]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const diagnosisData = {
        patientId: selectedPatientId,
        doctorId: data.doctor,
        diagnosisDetails: data.diagnosisDetails,
        condition: data.condition,
        symptoms: data.symptoms,
        notes: data.notes,
        followUpDate: data.followUpDate,
      };

      const response = await fetch('/api/create-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(diagnosisData),
      });

      if (response.ok) {
        toast.success("Diagnosis submitted successfully!");
        reset();  // Reset the form after successful submission
      } else {
        toast.error("Failed to submit diagnosis.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the diagnosis.");
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setPatientNameSearch(""); // Reset the search field
    setPatientList([]); // Clear the dropdown list
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h2 className="text-center text-2xl font-semibold mb-6">Patient Diagnosis Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            value={patientNameSearch}
            onChange={(e) => setPatientNameSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Patient Name"
          />
          {patientList.length > 0 && (
            <ul className="mt-2 border border-gray-300 max-h-48 overflow-y-auto">
              {patientList.map((patient) => (
                <li
                  key={patient._id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handlePatientSelect(patient._id)}
                >
                  {patient.userId.firstName} {patient.userId.lastName}
                </li>
              ))}
            </ul>
          )}
          <p className="text-red-500 text-sm mt-1">{errors.patient?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            value={selectedPatientId} // This is the _id of the selected patient
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Patient ID"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Doctor ID</label>
          <input
            type="text"
            {...register("doctor")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Doctor ID"
          />
          <p className="text-red-500 text-sm mt-1">{errors.doctor?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Hospital ID</label>
          <input
            type="text"
            {...register("hospital")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Hospital ID (Optional)"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Diagnosis Details</label>
          <textarea
            {...register("diagnosisDetails")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Diagnosis Details"
          />
          <p className="text-red-500 text-sm mt-1">{errors.diagnosisDetails?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Condition</label>
          <input
            type="text"
            {...register("condition")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Condition"
          />
          <p className="text-red-500 text-sm mt-1">{errors.condition?.message}</p>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Symptoms</label>
          <input
            type="text"
            {...register("symptoms")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Symptoms (Optional)"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Additional Notes (Optional)"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Follow-up Date</label>
          <input
            type="date"
            {...register("followUpDate")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
        >
          Submit Diagnosis
        </button>
      </form>
    </div>
  );
};

export default PatientDiagnosis;
