// src/components/layout/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userRole }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Define navigation items based on user role
  const navigationItems = {
    patient: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: 'home' },
      { name: 'Medical History', path: '/patient/medical-history', icon: 'document' },
      { name: 'Find Doctors', path: '/patient/find-doctors', icon: 'search' },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: 'home' },
      { name: 'Patients', path: '/doctor/patients', icon: 'users' },
      { name: 'Create Diagnosis', path: '/doctor/diagnosis', icon: 'clipboard' },
      { name: 'Create Prescription', path: '/doctor/prescription', icon: 'medication' },
    ],
    pharmacy: [
      { name: 'Dashboard', path: '/pharmacy/dashboard', icon: 'home' },
      { name: 'Prescriptions', path: '/pharmacy/prescriptions', icon: 'document' },
    ],
    laboratory: [
      { name: 'Dashboard', path: '/laboratory/dashboard', icon: 'home' },
      { name: 'Test Reports', path: '/laboratory/reports', icon: 'chart' },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: 'home' },
      { name: 'User Management', path: '/admin/users', icon: 'users' },
      { name: 'Statistics', path: '/admin/stats', icon: 'chart' },
    ],
    dataentry: [
      { name: 'Dashboard', path: '/dataentry/dashboard', icon: 'home' },
      { name: 'Patient Diagnosis', path: '/dataentry/patientdiagnosis', icon: 'document' },
      { name: 'Prescriptions', path: '/dataentry/patientprescriptions', icon: 'clipboard' },
    ],
  };

  // Get navigation items based on user role
  const items = navigationItems[userRole] || [];

  // Icon component
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'search':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'medication':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile sidebar toggle - only shown on mobile */}
      <div className="md:hidden z-20 fixed top-4 left-4">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)} 
          className="p-2 bg-white text-gray-600 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Backdrop for mobile - only appears when sidebar is open on mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar component - desktop always showing, mobile conditional */}
      <div 
        className={`bg-white shadow-lg md:w-64 w-3/4 fixed h-full overflow-y-auto 
                    md:sticky top-0 left-0 transform transition-transform duration-300 ease-in-out 
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:translate-x-0 z-30 md:z-10`}
        style={{ height: 'calc(100vh - 64px)' }} // Adjust based on your navbar height
      >
        <div className="h-full py-4">
          <div className="px-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 capitalize">
              {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : ''} Menu
            </h2>
          </div>
          
          <nav className="space-y-1 px-2">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-4 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`mr-3 ${isActive ? 'text-indigo-700' : 'text-gray-500 group-hover:text-gray-600'}`}>
                    {renderIcon(item.icon)}
                  </div>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;