import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientPrescriptionDisplay = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get('/api/prescriptions');
        // ✅ Check if it's an array or object
        const data = res.data;
        if (Array.isArray(data)) {
          setPrescriptions(data); // response is array
        } else if (Array.isArray(data.prescriptions)) {
          setPrescriptions(data.prescriptions); // response is { prescriptions: [...] }
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
      <ul className="space-y-4">
        {prescriptions.map(prescription => (
          <li key={prescription._id} className="border p-4 rounded">
            <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {prescription.status}</p>
            <p><strong>Notes:</strong> {prescription.notes || 'N/A'}</p>
            <h4 className="mt-2 font-semibold">Medications:</h4>
            <ul className="list-disc pl-5">
              {prescription.medications.map((med, i) => (
                <li key={i}>
                  {med.name} – {med.dosage}, {med.frequency}, {med.duration}
                  {med.instructions && ` (${med.instructions})`}
                </li>
              ))}
            </ul>
            <p className="mt-2">
              <strong>Purchased From:</strong> {prescription.purchasedFrom?.replace("_", " ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientPrescriptionDisplay;
