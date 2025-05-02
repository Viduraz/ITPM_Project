import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrescriptionUpdate = ({ match }) => {
  const { id } = match.params;
  const [formData, setFormData] = useState({
    status: '',
    purchasedFrom: '',
    date: '',
    medications: [],
    diagnosis: ''
  });

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await axios.get(`/api/prescriptions/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching prescription data:', error);
      }
    };
    fetchPrescription();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/prescriptions/${id}`, formData);
      alert('Prescription updated successfully');
    } catch (error) {
      console.error('Error updating prescription:', error);
      alert('Failed to update prescription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Date */}
      <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
      
      {/* Status */}
      <input type="text" name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
      
      {/* Medications */}
      <textarea
        name="medications"
        value={formData.medications}
        onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
      />
      
      {/* Diagnosis */}
      <input type="text" name="diagnosis" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} />
      
      <button type="submit">Update Prescription</button>
    </form>
  );
};

export default PrescriptionUpdate;
