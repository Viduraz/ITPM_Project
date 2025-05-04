import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const DiagnosisUpdate = () => {
  const { id } = useParams();
  const [diagnosis, setDiagnosis] = useState({
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
          `http://localhost:3000/api/dataentry/diagnoses/${id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          }
        );
        
        console.log(response.data);  // Verify the data returned from the API

        const data = response.data;
        setDiagnosis({
          hospitalId: data.hospitalId || '',
          condition: data.condition || '',
          diagnosisDetails: data.diagnosisDetails || '',
          symptoms: Array.isArray(data.symptoms) ? data.symptoms.join(', ') : '',
          notes: data.notes || '',
          followUpDate: data.followUpDate?.slice(0, 10) || '',
        });
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
    setDiagnosis((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/dataentry/diagnoses/${id}`,
        {
          ...diagnosis,
          symptoms: diagnosis.symptoms
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      alert('Diagnosis updated successfully');
      navigate('/dataentry/diagnosislist');
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      setErrorMessage('Failed to update diagnosis');
    } finally {
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
        <div>
          <label className="block text-sm font-medium text-gray-600">Hospital ID</label>
          <input
            type="text"
            name="hospitalId"
            value={diagnosis.hospitalId}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Condition</label>
          <input
            type="text"
            name="condition"
            value={diagnosis.condition}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Diagnosis Details</label>
          <textarea
            name="diagnosisDetails"
            value={diagnosis.diagnosisDetails}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Symptoms</label>
          <textarea
            name="symptoms"
            value={diagnosis.symptoms}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g. fever, headache"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Notes</label>
          <textarea
            name="notes"
            value={diagnosis.notes}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            value={diagnosis.followUpDate}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

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
