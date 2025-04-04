import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './pages/context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Public Pages
import Home from './pages/Home';

// Dashboard Pages
import PatientDashboard from './pages/Patient/PatientDashboard';
import MedicalHistory from './pages/patient/MedicalHistory';
import DoctorSearch from './pages/patient/DoctorSearch';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientManagement from './pages/doctor/PatientManagement';
import DiagnosisForm from './pages/doctor/DiagnosisForm';
import PrescriptionForm from './pages/doctor/PrescriptionForm';

import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import PrescriptionVerification from './pages/pharmacy/PrescriptionVerification';

import LaboratoryDashboard from './pages/laboratory/LaboratoryDashboard';
import TestReports from './pages/laboratory/TestReports';

import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import SystemStats from './admin/SystemStats';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to role-specific dashboard if authenticated but wrong role
    if (user.role === 'patient') return <Navigate to="/patient/dashboard" />;
    if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" />;
    if (user.role === 'pharmacy') return <Navigate to="/pharmacy/dashboard" />;
    if (user.role === 'laboratory') return <Navigate to="/laboratory/dashboard" />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role === 'patient') return <Navigate to="/patient/dashboard" />;
  if (user.role === 'doctor') return <Navigate to="/doctor/dashboard" />;
  if (user.role === 'pharmacy') return <Navigate to="/pharmacy/dashboard" />;
  if (user.role === 'laboratory') return <Navigate to="/laboratory/dashboard" />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" />;
  
  return <Navigate to="/" />;
};

// Layout Component
const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar userRole={user?.role} />
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRoles={['patient', 'admin']}>
              <DashboardLayout>
                <PatientDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/patient/medical-history" element={
            <ProtectedRoute allowedRoles={['patient', 'admin']}>
              <DashboardLayout>
                <MedicalHistory />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/patient/find-doctors" element={
            <ProtectedRoute allowedRoles={['patient', 'admin']}>
              <DashboardLayout>
                <DoctorSearch />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DashboardLayout>
                <DoctorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DashboardLayout>
                <PatientManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/diagnosis/:patientId?" element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DashboardLayout>
                <DiagnosisForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/prescription/:patientId?" element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DashboardLayout>
                <PrescriptionForm />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Pharmacy Routes */}
          <Route path="/pharmacy/dashboard" element={
            <ProtectedRoute allowedRoles={['pharmacy', 'admin']}>
              <DashboardLayout>
                <PharmacyDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/prescriptions" element={
            <ProtectedRoute allowedRoles={['pharmacy', 'admin']}>
              <DashboardLayout>
                <PrescriptionVerification />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Laboratory Routes */}
          <Route path="/laboratory/dashboard" element={
            <ProtectedRoute allowedRoles={['laboratory', 'admin']}>
              <DashboardLayout>
                <LaboratoryDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/laboratory/reports" element={
            <ProtectedRoute allowedRoles={['laboratory', 'admin']}>
              <DashboardLayout>
                <TestReports />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <UserManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <SystemStats />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
