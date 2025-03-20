import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../pages/context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar Navbar */}
      <nav className="w-72 h-screen bg-[#367588] text-white shadow-lg fixed top-0 left-0 p-4">
  <div className="flex flex-col h-full">
    <div className="flex-shrink-0 flex items-center mb-6">
      <Link to="/" className="text-[#ffffff] text-xl font-bold">
        MedHistory System
      </Link>
    </div>
    <div className="flex-grow">
      {user ? (
        <>
          <span className="text-white text-sm block mb-4">
            Welcome, {user.firstName} {user.lastName}
          </span>
          
          {/* Navigation Links for Logged-in Users */}
          <Link to="/patients" className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mb-2">
            Patient Section
          </Link>
          
          <Link to="/reports" className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mb-2">
            Report Section
          </Link>
          
          <Link to="/diagnosis" className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mb-2">
            Diagnosis Section
          </Link>
          
          <Link to="/prescriptions" className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mb-2">
            Prescription Section
          </Link>
          
          <Link to="/settings" className="block text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mb-2">
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 w-full mt-4"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          {/* Navigation Links for Guest Users (Login and Register) */}
          <Link to="/login" className="block text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium mb-2">
            Login
          </Link>
          <Link to="/register" className="block bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 mb-2">
            Register
          </Link>
        </>
      )}
    </div>
  </div>
</nav>

      
      {/* Page Content */}
      <div className="flex-1 ml-64 p-4">
        {/* Content Goes Here */}
      </div>
    </div>
  );
};

export default Navbar;
