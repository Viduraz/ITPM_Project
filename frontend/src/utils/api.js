import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  // Doctor endpoints
  getDoctorProfile: async (doctorId, token) => {
    const url = doctorId ? `${API_BASE_URL}/doctor/profile/${doctorId}` : `${API_BASE_URL}/doctor/profile`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  updateDoctorAvailability: async (hospitalId, isAvailable, token) => {
    return axios.put(`${API_BASE_URL}/doctor/availability`, {
      hospitalId,
      isAvailable
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  searchPatients: async (query, token) => {
    return axios.get(`${API_BASE_URL}/doctor/patients/search`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Patient endpoints
  getPatientProfile: async (token) => {
    return axios.get(`${API_BASE_URL}/patient/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  searchDoctors: async (query, hospitalId, token) => {
    return axios.get(`${API_BASE_URL}/patient/doctors/search`, {
      params: { query, hospitalId },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  getPatientMedicalHistory: async (token) => {
    return axios.get(`${API_BASE_URL}/patient/medical-history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  getHospitals: async (token) => {
    return axios.get(`${API_BASE_URL}/patient/hospitals`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  
  // Auth endpoints
  login: async (email, password) => {
    return axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
  },
  
  register: async (userData) => {
    return axios.post(`${API_BASE_URL}/auth/register`, userData);
  },
};

export default api;