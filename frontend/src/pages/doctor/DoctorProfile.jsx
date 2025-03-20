import React from 'react';
import foamBg from '../../../public/images/foamBg.png'

const DoctorProfile = () => {
  return (
    <div 
      className="min-h-screen p-6 w-full   text-gray-800"
      
    >
      {/* Header */}
      <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-indigo-800 transform hover:scale-105 transition-transform duration-300 hover:text-indigo-600 cursor-default">
  Doctor Profile Setup
</h1>
        
        <p className="text-gray-600">Complete your professional profile to get started</p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl  mx-auto /95 p-8 rounded-lg shadow-2xl  transition-shadow duration-300">
        <form className="space-y-8">
          {/* Basic Information */}
          <section className=" p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
              <span className="mr-2">📋</span> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name and Title 
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Dr. John Smith, MD"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo 
                </label>
                <input
                  type="file"
                  id="profilePhoto"
                  name="profilePhoto"
                  className="w-full border border-blue-900 p-2 rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section className=" p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-purple-800 flex items-center">
              <span className="mr-2"></span> Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty / Department 
                </label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  placeholder="e.g. Cardiology"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Position / Role 
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  placeholder="e.g. Consultant"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                  Education 
                </label>
                <textarea
                  id="education"
                  name="education"
                  rows={3}
                  placeholder="Medical school, residency, certifications..."
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label htmlFor="boardCertifications" className="block text-sm font-medium text-gray-700 mb-1">
                  Board Certifications 📜
                </label>
                <textarea
                  id="boardCertifications"
                  name="boardCertifications"
                  rows={3}
                  placeholder="List your certifications..."
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </section>

          {/* Availability & Contact */}
          <section className=" p-6 rounded-lg border border-blue-900">
            <h2 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="mr-2"></span> Availability & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="locations" className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Locations 
                </label>
                <textarea
                  id="locations"
                  name="locations"
                  rows={3}
                  placeholder="List your clinics or hospitals"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="consultationHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Hours 
                </label>
                <textarea
                  id="consultationHours"
                  name="consultationHours"
                  rows={3}
                  placeholder="e.g. Mon-Fri 9 AM - 5 PM"
                  className="w-full border border-blue-900 p-3 rounded-md transition duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 flex items-center"
            >
              <span className="mr-2"></span>
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile;
