import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PatientEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // If data was passed via navigation state, use it
        if (location.state?.patient) {
          const { user, profile } = location.state.patient;
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNumber: user.contactNumber || '',
            IdNumber: user.IdNumber || '',
            profile: profile || {
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
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token is missing. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`http://localhost:3000/api/auth/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const { user, profile } = response.data;
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber || '',
          IdNumber: user.IdNumber || '',
          profile: profile || {
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
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to retrieve patient data');
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [id, location.state]);
  
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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        return;
      }
      
      await axios.put(`http://localhost:3000/api/auth/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccessMessage('Patient information updated successfully!');
      
      // Immediately redirect to admin dashboard without the delay
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update patient');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
            onClick={() => navigate('/admin')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Edit Patient</h2>
        <p className="text-gray-600">Update patient information</p>
      </div>
      
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Number</label>
            <input
              type="text"
              name="IdNumber"
              value={formData.IdNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="profile.dateOfBirth"
                value={formData.profile.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="profile.gender"
                value={formData.profile.gender}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Type</label>
              <select
                name="profile.bloodType"
                value={formData.profile.bloodType}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900">Allergies</h3>
          
          {formData.profile.allergies.map((allergy, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={allergy}
                onChange={(e) => handleAllergiesChange(e, index)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Allergy"
              />
              <button
                type="button"
                onClick={() => removeAllergy(index)}
                className="bg-red-100 text-red-600 p-2 rounded-md"
              >
                &times;
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addAllergy}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add Allergy
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.profile.emergencyContact?.name || ''}
                onChange={handleEmergencyContactChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship</label>
              <input
                type="text"
                name="relationship"
                value={formData.profile.emergencyContact?.relationship || ''}
                onChange={handleEmergencyContactChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.profile.emergencyContact?.phone || ''}
                onChange={handleEmergencyContactChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientEditForm;