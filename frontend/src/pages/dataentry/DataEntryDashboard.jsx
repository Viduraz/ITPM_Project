import React from "react";
import { FaUserCircle } from "react-icons/fa";
import PatientPrescriptionDisplay from './PatientPrescriptionDisplay'; // <-- ✅ Import here


const DataEntryDashboard = () => {
  return (
    <div className="w-full">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-blue-700 text-white p-8 rounded-lg shadow-xl flex justify-between items-center mb-8">
          <div className="w-full">
            <h1 className="text-3xl font-semibold mb-3">Good Day, Data Entry!</h1>
            <p className="text-lg">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date())}
              ,{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>



          </div>
          
          <span className="text-lg font-medium">Have a productive workday!</span>

        </header>

        {/* Dashboard Body */}
        <div className="bg-white border border-blue-400 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Records Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Total Records</h3>
              <p className="text-4xl font-bold text-indigo-600">125</p>
            </div>

            {/* Pending Entries Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Pending Entries</h3>
              <p className="text-4xl font-bold text-yellow-600">10</p>
            </div>

            {/* Completed Entries Card */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Completed Entries</h3>
              <p className="text-4xl font-bold text-green-600">115</p>
            </div>
          </div>


        </div>

        {/* Profile & Calendar Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Profile Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Profile</h3>
            <div className="flex items-center gap-6">
              <FaUserCircle className="w-20 h-20 text-blue-500" />
              <div>
                <p className="text-2xl font-semibold">John Doe</p>
                <p className="text-lg text-gray-600">Data Entry Specialist</p>
                <div className="text-sm text-gray-500 mt-2">
                  <p>📍 Location: Berlin, Germany</p>
                  <p>📧 Email: johndoe@example.com</p>
                  <p>📞 Phone: +49 123 456 789</p>
                </div>
              </div>
            </div>

            {/* Additional Profile Info */}
            <div className="mt-6 border-t pt-6">
              <p className="text-sm text-gray-600">🕒 Working Hours: 9 AM - 5 PM</p>
              <p className="text-sm text-gray-600">📅 Joined: Jan 10, 2023</p>
              <p className="text-sm text-gray-600">✅ Accuracy Rate: 98%</p>
              <p className="text-sm text-gray-600">📄 Total Entries: 5,432</p>
            </div>
          </div>

          {/* Meeting List Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Meetings</h3>

            {/* Meeting List */}
            <div className="space-y-6">
              {/* Meeting 1 */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Project Sync</p>
                  <p className="text-sm text-gray-600">March 22, 2025 - 10:00 AM</p>
                </div>
                <button className="text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none">
                  Join
                </button>
              </div>

              {/* Meeting 2 */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Team Catch-up</p>
                  <p className="text-sm text-gray-600">March 22, 2025 - 2:00 PM</p>
                </div>
                <button className="text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none">
                  Join
                </button>
              </div>

              {/* Meeting 3 */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">Client Meeting</p>
                  <p className="text-sm text-gray-600">March 23, 2025 - 9:00 AM</p>
                </div>
                <button className="text-indigo-600 font-semibold hover:text-indigo-700 focus:outline-none">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">My Calendar</h3>
            <div className="text-center">
              <div className="font-bold text-2xl mb-4">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              <div className="grid grid-cols-7 gap-4 font-medium text-gray-700">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-4 mt-2">
                {Array.from({ length: 35 }, (_, i) => (
                  <div
                    key={i}
                    className={`p-3 text-center ${i + 1 === new Date().getDate() ? 'bg-blue-500 text-white rounded-full' : ''}`}
                  >
                    {i < 31 ? i + 1 : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 🔽 Add Prescription Display Below Everything */}
        <div className="mt-12">
          <PatientPrescriptionDisplay />
        </div>
      </div>
    </div>
  );
};

export default DataEntryDashboard;
