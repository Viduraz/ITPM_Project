import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object().shape({
  patient: yup.string().required("Patient ID is required"),
  doctor: yup.string().required("Doctor ID is required"),
  hospital: yup.string().optional(),
  diagnosisDetails: yup.string().required("Diagnosis details are required"),
  condition: yup.string().required("Condition is required"),
  symptoms: yup.string().optional(),
  notes: yup.string().optional(),
  followUpDate: yup.date().optional(),
});

const PatientDiagnosis = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Destructure reset from useForm
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Diagnosis Data:", data);
    toast.success("Diagnosis submitted successfully!");
    reset(); // Reset the form fields
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h2 className="text-center text-2xl font-semibold mb-6">Patient Diagnosis Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Patient ID</label>
          <input
            type="text"
            {...register("patient")}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Patient ID"
          />
          <p className="text-red-500 text-sm mt-1">{errors.patient?.message}</p>
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
