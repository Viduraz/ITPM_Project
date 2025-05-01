import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../pages/context/AuthContext';
import { FaPills, FaFileInvoiceDollar, FaMoneyBillWave, FaPrescriptionBottleAlt, FaSearch, FaClipboardList } from 'react-icons/fa';

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pharmacyData, setPharmacyData] = useState(null);
  const [posData, setPosData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        // Fetch pharmacy profile data
        const profileResponse = await axios.get('http://localhost:3000/api/pharmacy/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch POS summary data
        const posResponse = await axios.get('http://localhost:3000/api/pos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch recent prescriptions
        const prescriptionsResponse = await axios.get('http://localhost:3000/api/pharmacy/prescriptions', {
          params: { status: 'active' },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPharmacyData(profileResponse.data.pharmacy);
        setPosData(posResponse.data);
        setPrescriptions(prescriptionsResponse.data.prescriptions || []);
        
      } catch (err) {
        console.error('Error fetching pharmacy data:', err);
        setError(err.message || 'Failed to load pharmacy data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <p className="mt-2">
          This is a test version. For development purposes, you can proceed with mock data.
        </p>
      </div>
    );
  }

  // For testing: Use mock data if real data fails to load
  const mockPosData = {
    totalSold: 1245,
    totalInvoices: 364,
    totalRevenue: 86750.50
  };

  const mockPrescriptions = [
    { 
      id: "p1", 
      patientName: "John Smith", 
      medications: [
        { name: "Amoxicillin 500mg", dosage: "1 tablet", frequency: "3 times daily" },
        { name: "Ibuprofen 400mg", dosage: "1 tablet", frequency: "as needed" }
      ],
      date: "2023-04-14"
    },
    { 
      id: "p2", 
      patientName: "Sarah Johnson", 
      medications: [
        { name: "Lisinopril 10mg", dosage: "1 tablet", frequency: "daily" }
      ],
      date: "2023-04-14" 
    },
    { 
      id: "p3", 
      patientName: "Robert Chen", 
      medications: [
        { name: "Metformin 500mg", dosage: "1 tablet", frequency: "twice daily" },
        { name: "Atorvastatin 20mg", dosage: "1 tablet", frequency: "at bedtime" }
      ],
      date: "2023-04-13" 
    }
  ];

  const displayData = posData || mockPosData;
  const displayPrescriptions = prescriptions.length ? prescriptions : mockPrescriptions;
  
  return (
    <div className="pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-400 text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome, {pharmacyData?.name || user?.firstName || "Pharmacy Staff"}!
            </h1>
            <p className="mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Link 
              to="/pharmacy/prescriptions" 
              className="bg-white text-emerald-600 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center gap-2"
            >
              <FaPrescriptionBottleAlt /> All Prescriptions
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-emerald-500">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-full">
              <FaPills className="text-emerald-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Medicines Sold</h3>
              <p className="text-xl font-semibold">{displayData.totalSold.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaFileInvoiceDollar className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Invoices</h3>
              <p className="text-xl font-semibold">{displayData.totalInvoices.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Revenue</h3>
              <p className="text-xl font-semibold">Rs. {displayData.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search for prescriptions..."
          />
        </div>
      </div>
      
      {/* Pending Prescriptions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            <FaClipboardList className="inline mr-2 text-emerald-600" />
            Pending Prescriptions
          </h2>
          <Link to="/pharmacy/prescriptions" className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {displayPrescriptions.map(prescription => (
            <div key={prescription.id} className="border-b pb-3 last:border-0">
              <div className="flex justify-between">
                <h3 className="font-medium">{prescription.patientName}</h3>
                <span className="text-sm text-gray-500">{prescription.date}</span>
              </div>
              <div className="mt-2">
                {prescription.medications && prescription.medications.map((med, idx) => (
                  <div key={idx} className="text-gray-600 text-sm">
                    • {med.name} - {med.dosage} {med.frequency && `(${med.frequency})`}
                  </div>
                ))}
              </div>
              <button className="mt-3 text-sm text-white bg-emerald-600 px-3 py-1 rounded hover:bg-emerald-700">
                Process Prescription
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;