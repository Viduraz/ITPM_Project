import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DiagnosisUpdate = () => {
  const { id } = useParams();  // Get the diagnosis ID from the URL
  const navigate = useNavigate();  // For navigation after successful update
  
  // State to store diagnosis data and loading state
  const [diagnosis, setDiagnosis] = useState({
    condition: '',
    description: '',
    treatment: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch diagnosis data by ID
  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await axios.get(`/api/diagnoses/${id}`);
        setDiagnosis(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch diagnosis details.');
        setLoading(false);
      }
    };
    fetchDiagnosis();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiagnosis((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission to update diagnosis
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`/api/diagnoses/${id}`, diagnosis);
      setLoading(false);
      if (response.status === 200) {
        navigate('/dataentry/diagnosislist');  // Navigate to the diagnosis list or any other page you want
      }
    } catch (error) {
      setError('Failed to update diagnosis.');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Update Diagnosis</h2>
      
      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Condition</label>
          <input
            type="text"
            name="condition"
            value={diagnosis.condition}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={diagnosis.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Treatment</label>
          <input
            type="text"
            name="treatment"
            value={diagnosis.treatment}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Diagnosis'}
        </button>
      </form>
    </div>
  );
};

export default DiagnosisUpdate;
