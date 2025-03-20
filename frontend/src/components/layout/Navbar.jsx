import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="w-64 bg-indigo-600 text-white p-4 h-screen">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dataentry/profile" className="text-black hover:text-indigo-200">Profile</Link>
        </li>
        <li className="mb-4">
          <Link to="/dataentry/diagnoses" className="text-black hover:text-indigo-200">Diagnoses</Link>
        </li>
        <li className="mb-4">
          <Link to="/dataentry/prescriptions" className="text-black hover:text-indigo-200">Prescriptions</Link>
        </li>
        <li className="mb-4">
          <Link to="/dataentry/patients" className="text-black hover:text-indigo-200">Patients</Link>
        </li>
        <li className="mb-4">
          <Link to="/logout" className="text-black hover:text-indigo-200">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
