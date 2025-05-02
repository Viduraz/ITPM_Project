import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Used for navigation

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/dataentry/prescriptions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPrescriptions(res.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error.response?.data || error.message);
        setError('Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/dataentry/prescriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrescriptions(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      alert('Failed to delete prescription');
    }
  };

  const handleUpdate = (id) => {
    navigate(`/dataentry/update/${id}`);
  };  

  if (loading) return <p>Loading prescriptions...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Prescription List</h2>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <ul className="space-y-6">
          {prescriptions.map((prescription) => (
            <li key={prescription._id} className="border border-gray-300 p-5 rounded-xl shadow-md">
              <div className="mb-2">
                <p><span className="font-medium">Date:</span> {new Date(prescription.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> {prescription.status}</p>
                <p><span className="font-medium">Purchased From:</span> {prescription.purchasedFrom}</p>
              </div>

              {prescription.medications?.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold">Medications:</p>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    {prescription.medications.map((med, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        <span className="font-medium">{med.name}</span> — {med.dosage} dose, {med.frequency}x/day, {med.duration} days
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prescription.notes && (
                <p className="mt-2 text-sm text-gray-600"><span className="font-medium">Notes:</span> {prescription.notes}</p>
              )}

              {prescription.pharmacyDetails?.pharmacyId && (
                <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Pharmacy ID:</span> {prescription.pharmacyDetails.pharmacyId}</p>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleUpdate(prescription._id)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(prescription._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionList;
