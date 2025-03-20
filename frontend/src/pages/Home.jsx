import { Link } from "react-router-dom";
import { useAuth } from "../pages/context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Home = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString();

  console.log("Current Date:", currentDate); // Debugging to check if date is generated

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 ml-0 flex flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
          <section
            className="bg-[#A4C8E1] text-[#4338CA] relative"
            style={{
              backgroundImage: "url(/src/pages/images/cross.png)",
              backgroundSize: "auto",
              backgroundPosition: "left",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Content */}
            <div className="container mx-auto px-6 py-16 md:py-24 text-center relative z-10">
              <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10 text-left">
                <h1 className="text-3xl md:text-3xl font-bold mb-2">
                  Welcome to Medi Care Hospitals
                </h1>

                <p className=" text-gray-500 text-lg font-medium mb-6">
                  📅 Updated on: <strong>{currentDate}</strong>
                </p>
              </div>

              {/* profile icon */}
              <div className="absolute top-6 right-6 md:top-10 md:right-10 z-20 flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    className="px-4 py-2 rounded-full bg-blue-200 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search..."
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 0 24 24"
                    width="24px"
                    fill="#FFFFFF"
                    className="absolute right-2"
                  >
                    <path d="M21 19l-4-4m2-5a8 8 0 1 0-8 8 8 8 0 0 0 8-8z" />
                  </svg>
                </div>

                {/* Notification Icon */}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#FFFFFF"
                  >
                    <path d="M180-204.62v-59.99h72.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H780v59.99H180Zm300-293.07Zm-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z" />
                  </svg>
                </span>

                {/* Profile Icon */}
                <span className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="94px"
                    fill="#FFFFFF"
                  >
                    <path d="M240.92-268.31q51-37.84 111.12-59.77Q412.15-350 480-350t127.96 21.92q60.12 21.93 111.12 59.77 37.3-41 59.11-94.92Q800-417.15 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 62.85 21.81 116.77 21.81 53.92 59.11 94.92ZM480.01-450q-54.78 0-92.39-37.6Q350-525.21 350-579.99t37.6-92.39Q425.21-710 479.99-710t92.39 37.6Q610-634.79 610-580.01t-37.6 92.39Q534.79-450 480.01-450ZM480-100q-79.15 0-148.5-29.77t-120.65-81.08q-51.31-51.3-81.08-120.65Q100-400.85 100-480t29.77-148.5q29.77-69.35 81.08-120.65 51.3-51.31 120.65-81.08Q400.85-860 480-860t148.5 29.77q69.35 29.77 120.65 81.08 51.31 51.3 81.08 120.65Q860-559.15 860-480t-29.77 148.5q-29.77 69.35-81.08 120.65-51.3 51.31-120.65 81.08Q559.15-100 480-100Zm0-60q54.15 0 104.42-17.42 50.27-17.43 89.27-48.73-39-30.16-88.11-47Q536.46-290 480-290t-105.77 16.65q-49.31 16.66-87.92 47.2 39 31.3 89.27 48.73Q425.85-160 480-160Zm0-350q29.85 0 49.92-20.08Q550-550.15 550-580t-20.08-49.92Q509.85-650 480-650t-49.92 20.08Q410-609.85 410-580t20.08 49.92Q450.15-510 480-510Zm0-70Zm0 355Z" />
                  </svg>
                </span>

                <Link
                  to="/login"
                  className="block text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-6">
              {/* Statistics Section */}
              <div className="mt-12 text-left">
                <h3 className="text-2xl font-semibold mb-2">
                  System Statistics
                </h3>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Number of Patients */}
                  <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-3xl font-bold text-indigo-600 mb-2">
                      15,000+
                    </h4>
                    <p className="text-gray-600">Patients Registered</p>
                  </div>

                  {/* Number of Doctors */}
                  <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-3xl font-bold text-indigo-600 mb-2">
                      3,200+
                    </h4>
                    <p className="text-gray-600">Doctors Registered</p>
                  </div>

                  {/* Number of Data Entry Operators */}
                  <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-3xl font-bold text-indigo-600 mb-2">
                      500+
                    </h4>
                    <p className="text-gray-600">Data Entry Operators</p>
                  </div>
                </div>

                {/* Additional Statistics */}
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                  {/* Number of Surgeries Done */}
                  <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-3xl font-bold text-indigo-600 mb-2">
                      12,000+
                    </h4>
                    <p className="text-gray-600">Surgeries Done</p>
                  </div>

                  {/* Registered Pharmacies */}
                  <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-3xl font-bold text-indigo-600 mb-2">
                      120+
                    </h4>
                    <p className="text-gray-600">Registered Pharmacies</p>
                  </div>

                  {/* Medicine Count in Hospital Pharmacy */}
                  <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-3xl font-bold text-indigo-600 mb-2">
                      25,000+
                    </h4>
                    <p className="text-gray-600">Medicines in Pharmacy</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-[#A4C8E1] py-12">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to take control of your health data?
              </h2>
              <p className="text-xl mb-8">
                Join thousands of patients and healthcare providers on our
                platform.
              </p>

              {!user && (
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Get Started Today
                </Link>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
