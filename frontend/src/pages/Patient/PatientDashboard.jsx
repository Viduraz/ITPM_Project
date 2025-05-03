import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../pages/context/AuthContext';
import { FaCalendarAlt, FaFileMedical, FaUserMd, FaPills, FaFlask, FaHeartbeat, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const fetchPatientData = async () => {
    try {
      const data = await axios.get(`http://localhost:3000/api/patient/profile/${user.id}`);
      setPatientData(data.data.patient);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 128);
    doc.text("Patient Report", pageWidth / 2, 15, { align: 'center' });
    
    // Patient Info
    if (patientData) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${patientData.firstName} ${patientData.lastName}`, 20, 30);
      doc.text(`Email: ${patientData.email}`, 20, 37);
    }
    
    if (healthData) {
      // Health Summary Table
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128);
      doc.text("Health Summary", 20, 50);
      
      autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Value']],
        body: [
          ['Blood Pressure', healthData.vitals.bloodPressure],
          ['Heart Rate', healthData.vitals.heartRate],
          ['Temperature', healthData.vitals.temperature],
          ['Last Updated', healthData.vitals.lastUpdated]
        ],
        theme: 'grid',
        headStyles: { fillColor: [65, 105, 225], textColor: 255 },
        margin: { left: 20, right: 20 },
        styles: { overflow: 'linebreak' }
      });
      
      // Next Appointment Table
      let finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128);
      doc.text("Next Appointment", 20, finalY);
      
      autoTable(doc, {
        startY: finalY + 5,
        head: [['Doctor', 'Specialization', 'Date', 'Time']],
        body: [
          [
            healthData.nextAppointment.doctorName,
            healthData.nextAppointment.specialization,
            healthData.nextAppointment.date,
            healthData.nextAppointment.time
          ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [65, 105, 225], textColor: 255 },
        margin: { left: 20, right: 20 },
        styles: { overflow: 'linebreak' }
      });
      
      // Recent Diagnoses
      finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128);
      doc.text("Recent Diagnoses", 20, finalY);
      
      finalY += 8;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      healthData.recentDiagnoses.forEach((diagnosis, index) => {
        doc.text(`${index + 1}. ${diagnosis.condition} (Date: ${diagnosis.date}, Doctor: ${diagnosis.doctor})`, 
          20, finalY + (index * 7));
      });
      
      // Active Medications
      finalY = finalY + (healthData.recentDiagnoses.length * 7) + 15;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128);
      doc.text("Active Medications", 20, finalY);
      
      finalY += 8;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      healthData.recentPrescriptions.forEach((prescription, index) => {
        doc.text(`${index + 1}. ${prescription.medication} (Date: ${prescription.date}, Instructions: ${prescription.instructions})`, 
          20, finalY + (index * 7));
      });
    }

    doc.save("Patient_Report.pdf");
  };

  useEffect(() => {
    fetchPatientData();
    setTimeout(() => {
      setHealthData({
        nextAppointment: {
          doctorName: "Dr. Sarah Johnson",
          specialization: "Cardiologist",
          date: "May 15, 2023",
          time: "10:30 AM"
        },
        recentDiagnoses: [
          { id: "d1", condition: "Hypertension", date: "March 10, 2023", doctor: "Dr. Robert Chen" },
          { id: "d2", condition: "Seasonal Allergies", date: "February 22, 2023", doctor: "Dr. Maria Lopez" }
        ],
        recentPrescriptions: [
          { id: "p1", medication: "Lisinopril 10mg", instructions: "Take once daily", date: "March 10, 2023" },
          { id: "p2", medication: "Cetirizine 10mg", instructions: "Take as needed for allergies", date: "February 22, 2023" }
        ],
        recentLabResults: [
          { id: "l1", test: "Blood Panel", date: "March 8, 2023", status: "Completed" },
          { id: "l2", test: "Cholesterol Test", date: "March 8, 2023", status: "Completed" }
        ],
        vitals: {
          bloodPressure: "120/80 mmHg",
          heartRate: "72 bpm",
          temperature: "98.6°F",
          lastUpdated: "March 10, 2023"
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, {patientData?.firstName + " " + patientData?.lastName || 'Patient'}!</h1>
            <p className="mt-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={generateReport}
              className="bg-red-600 text-white font-medium px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center gap-2"
            >
              <FaFilePdf /> Generate Report
            </button>
            <Link
              to="/patient/find-doctors"
              className="bg-white text-indigo-600 font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center gap-2"
            >
              <FaUserMd /> Find Doctors
            </Link>
            <Link
              to="/patient/medical-history"
              className="bg-indigo-700 text-white font-medium px-4 py-2 rounded-md hover:bg-indigo-800 transition flex items-center gap-2"
            >
              <FaFileMedical /> Medical History
            </Link>
          </div>
        </div>
      </div>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-full">
              <FaHeartbeat className="text-indigo-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Blood Pressure</h3>
              <p className="text-xl font-semibold">{healthData.vitals.bloodPressure}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <FaCalendarAlt className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Next Appointment</h3>
              <p className="text-xl font-semibold">{healthData.nextAppointment.date}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaPills className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Active Medications</h3>
              <p className="text-xl font-semibold">{healthData.recentPrescriptions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaFlask className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Lab Results</h3>
              <p className="text-xl font-semibold">{healthData.recentLabResults.length} Recent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Appointment</h2>
          <Link to="/patient/appointments" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4 bg-indigo-50">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 text-white p-3 rounded-full hidden sm:block">
                <FaUserMd className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{healthData.nextAppointment.doctorName}</h3>
                <p className="text-gray-600">{healthData.nextAppointment.specialization}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Date</div>
                <div className="font-medium">{healthData.nextAppointment.date}</div>
              </div>
              
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Time</div>
                <div className="font-medium">{healthData.nextAppointment.time}</div>
              </div>
              
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Diagnoses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Diagnoses</h2>
            <Link to="/patient/medical-history" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {healthData.recentDiagnoses.map(diagnosis => (
              <div key={diagnosis.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <h3 className="font-medium">{diagnosis.condition}</h3>
                  <span className="text-sm text-gray-500">{diagnosis.date}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Diagnosed by: {diagnosis.doctor}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Prescriptions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Active Medications</h2>
            <Link to="/patient/prescriptions" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructions
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthData.recentPrescriptions.map(prescription => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {prescription.medication}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {prescription.instructions}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {prescription.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;