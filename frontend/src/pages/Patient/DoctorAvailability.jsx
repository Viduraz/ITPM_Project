import React from 'react';
import { useLocation } from 'react-router-dom';

const DoctorAvailability = () => {
  const location = useLocation();
  const doctor = location.state?.doctor;

  if (!doctor) {
    return <div>No doctor information available</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Doctor Info Card */}
      <div className="bg-white rounded shadow p-6 mb-4">
        <h1 className="text-xl font-bold text-gray-800">{doctor.name}</h1>
        <p className="text-gray-600 mt-1">{doctor.title}</p>
        <p className="text-sm text-gray-500 mt-2">
          Special Notes: SRI JAYAWARDENEPURA FACULTY / NO REFUNDS AND CANCELLATIONS
        </p>
        <p className="text-sm text-gray-500 mt-1">
          ASIRI Medical Hospital - Kirula Road - Colombo 05
        </p>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded shadow p-6 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Sessions</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctor.sessions?.map((session, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.date} - {session.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.appointments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${session.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                        session.status === 'FULL' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Hospital Sessions */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Other Hospital Sessions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctor.otherLocations?.map((location, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;
