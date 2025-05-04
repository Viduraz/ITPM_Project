import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientAddForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactNumber: '',
    IdNumber: '',
    profile: {
      dateOfBirth: '',
      gender: '',
      bloodType: '',
      allergies: [],
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested fields (for profile data)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        emergencyContact: {
          ...formData.profile.emergencyContact,
          [name]: value
        }
      }
    });
  };

  const handleAllergiesChange = (e, index) => {
    const newAllergies = [...formData.profile.allergies];
    newAllergies[index] = e.target.value;
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        allergies: newAllergies
      }
    });
  };

  const addAllergy = () => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        allergies: [...formData.profile.allergies, '']
      }
    });
  };

  const removeAllergy = (index) => {
    const newAllergies = [...formData.profile.allergies];
    newAllergies.splice(index, 1);
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        allergies: newAllergies
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Create a new patient with role set to "patient"
      const patientData = {
        ...formData,
        role: 'patient'
      };
      
      await axios.post('http://localhost:3000/api/auth/register', patientData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccessMessage('Patient added successfully!');
      
      // Immediately redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add patient');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Add New Patient</h2>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center"
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">ID Number</label>
            <input
              type="text"
              name="IdNumber"
              value={formData.IdNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="profile.dateOfBirth"
              value={formData.profile.dateOfBirth}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Gender</label>
            <select
              name="profile.gender"
              value={formData.profile.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Blood Type</label>
            <select
              name="profile.bloodType"
              value={formData.profile.bloodType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 mb-2">Allergies</label>
          {formData.profile.allergies.map((allergy, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={allergy}
                onChange={(e) => handleAllergiesChange(e, index)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter allergy"
              />
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAllergy}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add Allergy
          </button>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.profile.emergencyContact.name}
              onChange={handleEmergencyContactChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Relationship</label>
            <input
              type="text"
              name="relationship"
              value={formData.profile.emergencyContact.relationship}
              onChange={handleEmergencyContactChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.profile.emergencyContact.phone}
              onChange={handleEmergencyContactChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientAddForm;