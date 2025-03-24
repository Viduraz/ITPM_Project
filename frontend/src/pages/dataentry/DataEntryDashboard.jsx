import React from "react";
import { FaUserCircle } from "react-icons/fa";

const DataEntryDashboard = () => {
  return (
    <div className="w-full">
      {/* Remove the duplicate Sidebar - it's already in DashboardLayout */}
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex justify-between items-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-lg shadow-md flex flex-col items-start relative w-full">
            <h1 className="mb-5 text-2xl font-semibold">Good Day, Data Entry!</h1>
            <span className="text-lg block">
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
            </span>
          </div>
          <span className="text-lg">Have a Nice Workday!</span>
        </header>

        {/* Dashboard Body */}
        <div className="bg-white border border-blue-400 p-6 rounded-lg shadow-md relative mb-6 h-105">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 border border-indigo-600 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Records
              </h3>
              <p className="text-3xl font-bold text-indigo-600">125</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Pending Entries
              </h3>
              <p className="text-3xl font-bold text-yellow-600">10</p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">
                Completed Entries
              </h3>
              <p className="text-3xl font-bold text-green-600">115</p>
            </div>
          </div>

          {/* Fix the image path - use relative path */}
          <img
            src="/public/dataentry/dataentry.png"
            alt="Data Entry"
            className="absolute bottom-1 right-10 w-60 h-60 object-cover rounded-lg"
          />
        </div>

        {/* Profile & Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Profile</h3>
            <div className="flex items-center gap-4 mt-4">
              <FaUserCircle className="w-16 h-16 text-blue-400" />

              <div>
                <p className="text-lg font-bold">John Doe</p>
                <p className="text-gray-500">Data Entry Specialist</p>
                <p className="text-sm text-gray-600 mt-1">
                  📍 Location: Berlin, Germany
                </p>
                <p className="text-sm text-gray-600">
                  📧 Email: johndoe@example.com
                </p>
                <p className="text-sm text-gray-600">
                  📞 Phone: +49 123 456 789
                </p>
              </div>
            </div>

            {/* Additional Profile Info */}
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-600">
                🕒 Working Hours: 9 AM - 5 PM
              </p>
              <p className="text-sm text-gray-600">📅 Joined: Jan 10, 2023</p>
              <p className="text-sm text-gray-600">✅ Accuracy Rate: 98%</p>
              <p className="text-sm text-gray-600">📄 Total Entries: 5,432</p>
            </div>
          </div>

          {/* Meeting List Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Meeting List
            </h3>

            {/* Meeting List */}
            <div className="mt-4">
              <ul className="space-y-4">
                {/* Example Meeting 1 */}
                <li className="flex justify-between items-center">
                  <div>
                    <p className="text-md font-semibold">Project Sync</p>
                    <p className="text-sm text-gray-600">
                      March 22, 2025 - 10:00 AM
                    </p>
                  </div>
                  <button className="text-indigo-600 font-semibold">
                    Join
                  </button>
                </li>

                {/* Example Meeting 2 */}
                <li className="flex justify-between items-center">
                  <div>
                    <p className="text-md font-semibold">Team Catch-up</p>
                    <p className="text-sm text-gray-600">
                      March 22, 2025 - 2:00 PM
                    </p>
                  </div>
                  <button className="text-indigo-600 font-semibold">
                    Join
                  </button>
                </li>

                {/* Example Meeting 3 */}
                <li className="flex justify-between items-center">
                  <div>
                    <p className="text-md font-semibold">Client Meeting</p>
                    <p className="text-sm text-gray-600">
                      March 23, 2025 - 9:00 AM
                    </p>
                  </div>
                  <button className="text-indigo-600 font-semibold">
                    Join
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Calendar Card - replace with a simple calendar display */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">My Calendar</h3>
            <div className="mt-4 text-center">
              <div className="font-bold text-xl mb-2">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
              <div className="grid grid-cols-7 gap-1 font-medium">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-1 mt-2">
                {Array.from({ length: 35 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`p-2 ${i + 1 === new Date().getDate() ? 'bg-blue-500 text-white rounded-full' : ''}`}
                  >
                    {i < 31 ? i + 1 : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntryDashboard;
