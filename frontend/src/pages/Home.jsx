// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../pages/context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion'; // You might need to install this: npm install framer-motion

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section with gradient background and wave shape */}
        <section className="relative bg-gradient-to-r from-indigo-700 to-purple-700 text-white overflow-hidden">
          {/* Wave shape divider */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] rotate-180">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
            </svg>
          </div>

          <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Advanced Medical History Management System
              </h1>
              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-indigo-100 leading-relaxed">
                Securely store, access, and manage your complete medical history across all healthcare providers in one unified platform.
              </p>
              
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="bg-white text-indigo-700 px-8 py-4 rounded-full font-medium hover:bg-opacity-90 transition duration-300 shadow-lg inline-block"
                  >
                    Go to Your Dashboard
                  </Link>
                </motion.div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="bg-white text-indigo-700 px-8 py-4 rounded-full font-medium hover:bg-opacity-90 transition duration-300 shadow-lg inline-block"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition duration-300 inline-block"
                    >
                      Register Now
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
        
        {/* Features Section with cards */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Powerful Features</h2>
              <div className="w-16 h-1 bg-indigo-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive system is designed to make healthcare management seamless and efficient.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="h-3 bg-indigo-600"></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Complete Medical Records</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Store your entire medical history including diagnoses, prescriptions, lab results, and imaging in one secure location.
                  </p>
                  <Link to={user ? "/dashboard" : "/register"} className="text-indigo-600 font-semibold inline-flex items-center">
                    Learn more 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="h-3 bg-purple-600"></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Advanced Security</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Control which healthcare providers can access your information with our robust permission system and encryption.
                  </p>
                  <Link to={user ? "/dashboard/security" : "/register"} className="text-purple-600 font-semibold inline-flex items-center">
                    Learn more 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="h-3 bg-blue-600"></div>
                <div className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Integrated Healthcare</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Connect doctors, pharmacies, and laboratories in one system for seamless healthcare management and coordination.
                  </p>
                  <Link to={user ? "/dashboard/network" : "/register"} className="text-blue-600 font-semibold inline-flex items-center">
                    Learn more 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Statistics Section */}
        <section className="bg-gradient-to-r from-indigo-800 to-purple-800 py-16 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white opacity-5 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">10k+</p>
                <p className="text-indigo-200">Patients Served</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">500+</p>
                <p className="text-indigo-200">Healthcare Providers</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-white"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">99%</p>
                <p className="text-indigo-200">Satisfaction Rate</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-white"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">24/7</p>
                <p className="text-indigo-200">Support Available</p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">What Our Users Say</h2>
              <div className="w-16 h-1 bg-indigo-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from healthcare professionals and patients who've experienced the difference.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-indigo-600">DR</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Dr. Robert Chen</h4>
                    <p className="text-indigo-600">Cardiologist</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "This platform has revolutionized how I manage patient information. The integration with lab systems saves countless hours and reduces errors in treatment decisions."
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-purple-600">SJ</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                    <p className="text-purple-600">Patient</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Having all my medical records in one place has been life-changing. When I had an emergency abroad, doctors could instantly access my history and allergies."
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-600">MP</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Maria Patel</h4>
                    <p className="text-blue-600">Hospital Administrator</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The operational efficiency we've gained is remarkable. Our staff spends less time on paperwork and more time focusing on what matters most - patient care."
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-20 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-6 text-center relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Ready to transform your healthcare experience?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto text-indigo-100">
              Join thousands of patients and healthcare providers who are already benefiting from our comprehensive platform.
            </p>
            
            {!user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 px-10 py-4 rounded-full font-medium hover:bg-opacity-90 transition duration-300 shadow-lg inline-flex items-center"
                >
                  Get Started Today
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </motion.div>
            )}
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="bg-white text-indigo-700 px-10 py-4 rounded-full font-medium hover:bg-opacity-90 transition duration-300 shadow-lg inline-flex items-center"
                >
                  Go to Dashboard
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;