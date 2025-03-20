// src/pages/patient/DoctorSearch.jsx
import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// 1. Define your specialties
const specialties = [
  { id: 'anesthesiology', name: 'Anesthesiology & Reanimation' },
  { id: 'dentistry',       name: 'Dentistry' },
  { id: 'dermatology',     name: 'Dermatology' },
  { id: 'ent',             name: 'Ear-Nose-Throat / Audiology' },
  { id: 'internal-med',    name: 'Internal Medicine' },
  { id: 'obgyn',           name: 'Obstetrics and Gynecology' },
  { id: 'orthopedics',     name: 'Orthopedics and Traumatology' },
  { id: 'pediatrics',      name: 'Pediatrics' },
  { id: 'radiology',       name: 'Radiology' },
  { id: 'urology',         name: 'Urology' },
];

// Add this featured doctors data near the top of the file
const featuredDoctors = [
  {
    id: 'f1',
    name: 'Dr. Sarah Wilson',
    title: 'Chief of Internal Medicine',
    specialty: 'Internal Medicine',
    image: 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg',
    sessions: [
      {
        date: 'March 30, 2025',
        time: '09:00 AM',
        appointments: 15,
        status: 'AVAILABLE',
        location: 'Central Hospital - Colombo'
      },
      {
        date: 'April 01, 2025',
        time: '02:00 PM',
        appointments: 8,
        status: 'AVAILABLE',
        location: 'Central Hospital - Colombo'
      }
    ],
    otherLocations: [
      'Central Hospital - Colombo',
      'Medicare Center - Nugegoda',
      'Family Care Clinic - Rajagiriya'
    ],
    rating: 4.9,
    experience: '15+ years',
    specialization: 'Diabetes & Endocrinology'
  },
  {
    id: 'f2',
    name: 'Dr. James Anderson',
    title: 'Senior Cardiologist',
    specialty: 'Cardiology',
    image: 'https://xsgames.co/randomusers/assets/avatars/male/11.jpg',
    sessions: [
      {
        date: 'March 29, 2025',
        time: '10:00 AM',
        appointments: 12,
        status: 'AVAILABLE',
        location: 'Heart Care Center - Colombo'
      }
    ],
    otherLocations: [
      'Heart Care Center - Colombo',
      'National Hospital - Colombo',
      'Private Practice - Bambalapitiya'
    ],
    rating: 4.8,
    experience: '20+ years',
    specialization: 'Interventional Cardiology'
  },
  {
    id: 'f3',
    name: 'Dr. Emily Chang',
    title: 'Pediatric Specialist',
    specialty: 'Pediatrics',
    image: 'https://xsgames.co/randomusers/assets/avatars/female/12.jpg',
    sessions: [
      {
        date: 'March 31, 2025',
        time: '09:00 AM',
        appointments: 20,
        status: 'AVAILABLE',
        location: 'Children\'s Hospital - Colombo'
      }
    ],
    otherLocations: [
      'Children\'s Hospital - Colombo',
      'Family Care Center - Dehiwala',
      'Kids Clinic - Battaramulla'
    ],
    rating: 4.9,
    experience: '12+ years',
    specialization: 'Child Development'
  }
];

// 2. Define doctor data for each specialty (example: 3 doctors each)
const doctorsData = {
  anesthesiology: [
    {
      id: 1,
      name: 'Dr. Mushtaq Ahmad',
      title: 'Consultant of Anesthesiology and Reanimation',
      specialty: 'Anesthesiology',
      image: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
      rating: 4.7,
      experience: '12+ years',
      specialization: 'General Anesthesia',
      sessions: [
        {
          date: 'March 29, 2025',
          time: '01:00 PM',
          appointments: 25,
          status: 'FULL',
          location: 'ASIRI Hospital - Colombo'
        },
        {
          date: 'March 31, 2025',
          time: '06:30 AM',
          appointments: 9,
          status: 'FULL',
          location: 'ASIRI Hospital - Colombo'
        },
        {
          date: 'April 05, 2025',
          time: '01:00 PM',
          appointments: 4,
          status: 'HALF',
          location: 'ASIRI Hospital - Colombo'
        }
      ],
      otherLocations: [
        'ASIRI Hospital - Galle',
        'ASIRI Surgical Hospital - Kirimandala Mw - Colombo 05',
        'Body Doc Medicare - Malabe'
      ]
    },
    {
      id: 2,
      name: 'Dr. John Smith',
      title: 'Anesthesiologist',
      specialty: 'Anesthesiology',
      image: 'https://xsgames.co/randomusers/assets/avatars/male/2.jpg',
      rating: 4.8,
      experience: '15+ years',
      specialization: 'Regional Anesthesia',
      sessions: [
        {
          date: 'March 30, 2025',
          time: '10:00 AM',
          appointments: 10,
          status: 'AVAILABLE',
          location: 'Central Hospital - Colombo'
        }
      ],
      otherLocations: [
        'Central Hospital - Colombo',
        'Medicare Center - Nugegoda'
      ]
    },
    {
      id: 3,
      name: 'Dr. Sarah Connor',
      title: 'Anesthesia Specialist',
      specialty: 'Anesthesiology',
      image: 'https://xsgames.co/randomusers/assets/avatars/female/3.jpg',
      rating: 4.9,
      experience: '10+ years',
      specialization: 'Pediatric Anesthesia',
      sessions: [
        {
          date: 'April 01, 2025',
          time: '09:00 AM',
          appointments: 8,
          status: 'AVAILABLE',
          location: 'Children\'s Hospital - Colombo'
        }
      ],
      otherLocations: [
        'Children\'s Hospital - Colombo',
        'Family Care Center - Dehiwala'
      ]
    },
  ],
  dentistry: [
    {
      id: 4,
      name: 'Dr. Jane Doe',
      title: 'Dentist',
      image: 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg',
    },
    {
      id: 5,
      name: 'Dr. Emily White',
      title: 'Pediatric Dentist',
      image: 'https://xsgames.co/randomusers/assets/avatars/female/5.jpg',
    },
    {
      id: 6,
      name: 'Dr. Carlos Garcia',
      title: 'Oral Surgeon',
      image: 'https://xsgames.co/randomusers/assets/avatars/male/6.jpg',
    },
  ],
  dermatology: [
    {
      id: 7,
      name: 'Dr. Kevin Patel',
      title: 'Dermatologist',
      image: 'https://xsgames.co/randomusers/assets/avatars/male/7.jpg',
    },
    {
      id: 8,
      name: 'Dr. Nina Brown',
      title: 'Skin Care Specialist',
      image: 'https://xsgames.co/randomusers/assets/avatars/female/8.jpg',
    },
    {
      id: 9,
      name: 'Dr. Mark Liu',
      title: 'Cosmetic Dermatologist',
      image: 'https://xsgames.co/randomusers/assets/avatars/male/9.jpg',
    },
  ],
  // ...and so on for the other specialties
};

const DoctorSearch = () => {
  // 3. Read the "specialty" param from the URL (if any)
  const { specialty } = useParams();
  const navigate = useNavigate();

  // 4. Get doctors for the selected specialty
  const doctors = specialty && doctorsData[specialty] ? doctorsData[specialty] : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const handleViewProfile = (doctor) => {
    navigate('/doctor-availability', { state: { doctor } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <header className="bg-purple-200 shadow p-4">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Our Healthcare Professionals
        </motion.h1>
      </header>

      <div className="max-w-7xl mx-auto p-4 mt-6 flex">
        <motion.aside 
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/4 mr-6 bg-white shadow rounded p-4"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Specialties
          </h2>
          <ul className="space-y-2">
            {specialties.map((spec) => (
              <li key={spec.id}>
                <Link
                  to={`/doctor-search/${spec.id}`}
                  className={`block px-2 py-1 rounded hover:bg-gray-100 ${
                    specialty === spec.id ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  {spec.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.aside>

        <motion.main 
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white shadow rounded p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Our highly skilled medical team
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Select a specialty from the left menu to see the doctors.
          </p>

          {/* Show doctors if a specialty is selected */}
          {specialty && doctors.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {doctors.map((doc) => (
                <motion.div
                  key={doc.id}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-20 h-20 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.title}</p>
                      <p className="text-sm text-indigo-600">{doc.specialty || specialty}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Experience:</span> {doc.experience || 'Not specified'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Specialization:</span> {doc.specialization || doc.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Rating:</span>{' '}
                      <span className="text-yellow-500">★</span> {doc.rating || '4.5'}
                    </p>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewProfile(doc)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    View Profile & Availability
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : specialty ? (
            // If user selected a specialty but there's no data
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500"
            >
              No doctors found for this specialty.
            </motion.p>
          ) : (
            // New featured doctors section
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-800 mb-6"
              >
                Featured Doctors
              </motion.h2>
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {featuredDoctors.map((doc) => (
                  <motion.div
                    key={doc.id}
                    variants={cardVariants}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-20 h-20 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{doc.name}</h3>
                        <p className="text-sm text-gray-600">{doc.title}</p>
                        <p className="text-sm text-indigo-600">{doc.specialty}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Experience:</span> {doc.experience}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Specialization:</span> {doc.specialization}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Rating:</span>{' '}
                        <span className="text-yellow-500">★</span> {doc.rating}
                      </p>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewProfile(doc)}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                      View Profile & Availability
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </motion.main>
      </div>
    </motion.div>
  );
};

export default DoctorSearch;
