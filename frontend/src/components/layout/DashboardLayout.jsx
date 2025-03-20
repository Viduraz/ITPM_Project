// src/components/layout/DashboardLayout.jsx
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../context/AuthContext';

// Define dashboard routes outside the component
const dashboardRoutes = {
  admin: '/admin/dashboard',
  doctor: '/doctor/dashboard',
  patient: '/patient/dashboard',
  pharmacy: '/pharmacy/dashboard',
  laboratory: '/laboratory/dashboard',
  dataentry: '/dataentry/dashboard', 
};

const DashboardLayout = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If requiredRole is specified and user doesn't have that role, redirect to their dashboard
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={dashboardRoutes[user.role] || '/dashboard'} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
