import React from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Calendar } from "../../components/ui/Calendar";
import Sidebar from "../../components/layout/Sidebar";
import { FaUserCircle } from "react-icons/fa";

const DataEntryDashboard = () => {
  return (
    <div className="w-296 flex ml-auto">
      <Sidebar userRole="dataentry" />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center relative">
          {/* Search Bar */}
          <div className="flex items-center border p-2 rounded-lg w-1/2">
            <input
              type="text"
              placeholder="Search..."
              className="outline-none w-full pl-2"
            />
          </div>
          
          {/* Notification and Profile Icons */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-4">
            {/* Notification Icon */}
            <div className="bg-blue-400 p-3 rounded-full cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF" // White color for the SVG icon
              >
                <path d="M180-204.62v-59.99h72.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H780v59.99H180Zm300-293.07Zm-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z" />
              </svg>
            </div>

            {/* Profile Icon */}
            <div className="bg-blue-600 p-1 rounded-full cursor-pointer">
              <FaUserCircle className="w-12 h-12 text-white" />{" "}
              {/* Updated profile icon */}
            </div>
          </div>
        </div>

        {/* Header */}

        <header className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex justify-between items-center">
          <div className=" bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 rounded-lg shadow-md flex flex-col items-start relative w-200">
            <h1 className="mb-5 text-2xl font-semibold">Good Day, Data Entry!</h1>
            <span className="text-lg block">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "long", // E.g., "Monday"
                year: "numeric", // E.g., "2025"
                month: "long", // E.g., "March"
                day: "numeric", // E.g., "21"
              }).format(new Date())}
              ,{" "}
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>{" "}
            {/* Formatted date and time */}
          </div>

          <span className="text-lg">Have a Nice Workday!</span>
        </header>

        {/* Dashboard Body */}
        <div className=" grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
          {/* Statistics Section */}
          <Card className="bg-white border border-blue-400 p-6 h-[400px] rounded-lg shadow-md relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Dashboard Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-100 border border-indigo-600 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Records
                </h3>
                <p className="text-3xl font-bold text-indigo-600">125</p>
              </Card>

              <Card className="bg-gray-100 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">
                  Pending Entries
                </h3>
                <p className="text-3xl font-bold text-yellow-600">10</p>
              </Card>
              <Card className="bg-gray-100 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">
                  Completed Entries
                </h3>
                <p className="text-3xl font-bold text-green-600">115</p>
              </Card>
            </div>

            {/* Bottom Right Image */}
            <img
              src="/public/dataentry/dataentry.png"
              alt="Data Entry"
              className="absolute bottom-1 right-10 w-60 h-60 object-cover rounded-lg "
            />
          </Card>
        </div>

        {/* Profile & Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Profile Card */}
          <Card className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Profile</h3>
            <div className="flex items-center gap-4 mt-4">
              {/* Font Awesome Profile Icon */}
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
          </Card>

          {/* Meeting List Card */}
          <Card className="bg-white p-6 rounded-lg shadow-md">
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
          </Card>

          {/* Calendar Card */}
          <Card className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">My Calendar</h3>
            <Calendar className="mt-4" />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataEntryDashboard;
