import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // useParams to fetch id from URL

const DiagnosisUpdate = () => {
  const { id } = useParams(); // Get the diagnosis ID from the URL
  const [diagnosis, setDiagnosis] = useState({
    patientId: '',
    doctorId: '',
    hospitalId: '',
    condition: '',
    diagnosisDetails: '',
    symptoms: '',
    notes: '',
    followUpDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/dataentry/diagnoses/${id}`, // Fetch diagnosis data by ID
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          }
        );
        setDiagnosis(response.data); // Set diagnosis data into state
      } catch (error) {
        console.error('Error fetching diagnosis data:', error);
        setErrorMessage('Failed to load diagnosis data');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosisData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiagnosis((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3000/api/dataentry/diagnoses/${id}`, // Update diagnosis by ID
        diagnosis,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      alert('Diagnosis updated successfully');
      navigate('/dataentry/diagnosislist'); // Redirect after update
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      setErrorMessage('Failed to update diagnosis');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="bg-red-100 text-red-700 p-4 m-4 rounded-md">
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Update Diagnosis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient ID */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={diagnosis.patientId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
            value={diagnosis.doctorId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter doctor ID"
            required
          />
        </div>

        {/* Hospital ID */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Hospital ID</label>
          <input
            type="text"
            name="hospitalId"
            value={diagnosis.hospitalId || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter hospital ID (optional)"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Condition</label>
          <input
            type="text"
            name="condition"
            value={diagnosis.condition}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter condition"
            required
          />
        </div>

        {/* Diagnosis Details */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Diagnosis Details</label>
          <textarea
            name="diagnosisDetails"
            value={diagnosis.diagnosisDetails}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter diagnosis details"
            required
          />
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Symptoms</label>
          <textarea
            name="symptoms"
            value={diagnosis.symptoms}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter symptoms"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Notes</label>
          <textarea
            name="notes"
            value={diagnosis.notes}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter any additional notes"
          />
        </div>

        {/* Follow-up Date */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            value={diagnosis.followUpDate || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Diagnosis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosisUpdate;
