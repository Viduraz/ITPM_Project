import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        console.log("Fetching prescriptions...");
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/dataentry/prescriptions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched data:", res.data);
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
  
  

  if (loading) return <p>Loading prescriptions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <ul className="space-y-4">
          {prescriptions.map((prescription) => (
            <li key={prescription._id} className="border p-4 rounded shadow">
              <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {prescription.status}</p>
              <p><strong>Purchased From:</strong> {prescription.purchasedFrom}</p>
              <p><strong>Diagnosis:</strong> {prescription.diagnosis?.description || 'N/A'}</p>

              {prescription.medications?.length > 0 && (
                <div>
                  <p className="font-semibold mt-2">Medications:</p>
                  <ul className="ml-4 list-disc">
                    {prescription.medications.map((med, index) => (
                      <li key={index}>
                        {med.name} - {med.dosage} - {med.frequency}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prescription.pharmacyDetails?.pharmacyId && (
                <p><strong>Pharmacy ID:</strong> {prescription.pharmacyDetails.pharmacyId}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionList;
