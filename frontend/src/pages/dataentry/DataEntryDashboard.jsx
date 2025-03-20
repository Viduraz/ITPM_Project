import React from "react";
import Sidebar from "../../components/layout/Sidebar"; // Assuming you have Sidebar component ready

const DataEntryDashboard = () => {
  return (
    <div className="w-296 flex ml-auto">
      <Sidebar userRole="dataentry" />

      {/* Main content area */}
      <div className="flex-1 bg-gray-50">
        {/* Dashboard Header */}
        <header className="bg-white shadow-md p-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Data Entry Dashboard
          </h1>
        </header>

        {/* Dashboard Body */}
        <div className="px-6 py-4">
          {/* Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Records
              </h3>
              <p className="text-2xl font-bold text-indigo-600">125</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Pending Entries
              </h3>
              <p className="text-2xl font-bold text-yellow-600">10</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                Completed Entries
              </h3>
              <p className="text-2xl font-bold text-green-600">115</p>
            </div>
          </div>

          {/* Data Table */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Entries
            </h3>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                    ID
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                    Patient Name
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                    Entry Type
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-6 text-sm text-gray-700">1</td>
                  <td className="py-3 px-6 text-sm text-gray-700">John Doe</td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    Medical History
                  </td>
                  <td className="py-3 px-6 text-sm text-green-600">
                    Completed
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500">
                    2025-03-20
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-sm text-gray-700">2</td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    Jane Smith
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    Prescription
                  </td>
                  <td className="py-3 px-6 text-sm text-yellow-600">Pending</td>
                  <td className="py-3 px-6 text-sm text-gray-500">
                    2025-03-19
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-sm text-gray-700">3</td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    Sarah Connor
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-700">
                    Medical History
                  </td>
                  <td className="py-3 px-6 text-sm text-green-600">
                    Completed
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500">
                    2025-03-18
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEntryDashboard;
