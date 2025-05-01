import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../pages/context/AuthContext';
import { FaClipboardList, FaPrescriptionBottleAlt, FaUserInjured, FaSearch, FaColumns, FaNotesMedical } from 'react-icons/fa';

function DataEntryDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [taskData, setTaskData] = useState(null);

  // Simulated data - in a real app, fetch from API
  useEffect(() => {
    setTimeout(() => {
      setTaskData({
        pendingEntries: [
          { id: "p1", patientName: "John Smith", documentType: "Lab Results", receivedDate: "April 14, 2023" },
          { id: "p2", patientName: "Maria Garcia", documentType: "Diagnosis", receivedDate: "April 14, 2023" },
          { id: "p3", patientName: "Robert Chen", documentType: "Prescription", receivedDate: "April 13, 2023" }
        ],
        recentlyCompleted: [
          { id: "r1", patientName: "Emma Wilson", documentType: "Lab Results", entryDate: "April 12, 2023" },
          { id: "r2", patientName: "James Brown", documentType: "Diagnosis", entryDate: "April 11, 2023" }
        ],
        stats: {
          totalPending: 8,
          completedToday: 5,
          pendingUrgent: 2
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.firstName || 'Data Entry Operator'}!</h1>
            <p className="mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Link 
              to="/dataentry/patientdiagnosis" 
              className="bg-white text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center gap-2"
            >
              <FaNotesMedical /> New Diagnosis
            </Link>
            <Link 
              to="/dataentry/patientprescriptions" 
              className="bg-blue-700 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-800 transition flex items-center gap-2"
            >
              <FaPrescriptionBottleAlt /> New Prescription
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaClipboardList className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Pending Entries</h3>
              <p className="text-xl font-semibold">{taskData.stats.totalPending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaColumns className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Completed Today</h3>
              <p className="text-xl font-semibold">{taskData.stats.completedToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full">
              <FaUserInjured className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Urgent Pending</h3>
              <p className="text-xl font-semibold">{taskData.stats.pendingUrgent}</p>
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
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for patient records..."
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Entries */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pending Data Entries</h2>
            <Link to="/dataentry/pending" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {taskData.pendingEntries.map(entry => (
              <div key={entry.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <h3 className="font-medium">{entry.patientName}</h3>
                  <span className="text-sm text-gray-500">{entry.receivedDate}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Document Type: {entry.documentType}</p>
                <button className="mt-2 text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
                  Process Entry
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recently Completed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recently Completed</h2>
            <Link to="/dataentry/completed" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {taskData.recentlyCompleted.map(entry => (
              <div key={entry.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <h3 className="font-medium">{entry.patientName}</h3>
                  <span className="text-sm text-gray-500">{entry.entryDate}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Document Type: {entry.documentType}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataEntryDashboard;