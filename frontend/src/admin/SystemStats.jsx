import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, FaUserInjured, FaFlask, FaPrescriptionBottleAlt, 
  FaHospital, FaUserEdit, FaServer, FaDownload, FaChartLine,
  FaUserShield, FaCalendarCheck, FaDatabase, FaClipboardList,
  FaClock, FaBug, FaShieldAlt
} from 'react-icons/fa';

function SystemStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setStats({
        users: {
          doctors: 278,
          patients: 5423,
          pharmacies: 89,
          laboratories: 42,
          dataEntry: 34,
          admins: 8,
          totalRegistered: 5874,
          activeNow: 328,
          growthRate: 12.4
        },
        activity: {
          appointmentsToday: 342,
          prescriptionsIssued: 187,
          labReportsGenerated: 94,
          diagnosesRecorded: 156,
          averageResponseTime: 1.8,
          peakHour: '10:00 AM',
          totalTransactions: 24589
        },
        system: {
          uptime: '99.98%',
          responseTime: '0.45s',
          errorRate: '0.02%',
          databaseSize: '2.8 GB',
          apiRequests: 58924,
          cacheHitRate: '94.2%',
          securityEvents: 6
        },
        content: {
          totalRecords: 26843,
          totalDiagnoses: 8347,
          totalPrescriptions: 12795,
          totalLabReports: 5701,
          documentsScanned: 4275,
          averageRecordSize: '2.4 MB',
          dataBackups: 84
        }
      });
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">System Statistics</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive overview of the Medical History Management System
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'activity' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'system' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              System
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'content' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Content
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-4xl font-bold">{stats.users.totalRegistered.toLocaleString()}</h3>
              <p className="text-indigo-100">Total Users</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold">{stats.activity.totalTransactions.toLocaleString()}</h3>
              <p className="text-indigo-100">Transactions</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold">{stats.content.totalRecords.toLocaleString()}</h3>
              <p className="text-indigo-100">Medical Records</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold">{stats.system.uptime}</h3>
              <p className="text-indigo-100">System Uptime</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">User Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <UserStatCard
                  icon={<FaUserMd className="text-blue-600" />}
                  count={stats.users.doctors}
                  label="Doctors"
                  bgColor="bg-blue-50"
                />
                <UserStatCard
                  icon={<FaUserInjured className="text-pink-600" />}
                  count={stats.users.patients}
                  label="Patients"
                  bgColor="bg-pink-50"
                />
                <UserStatCard
                  icon={<FaPrescriptionBottleAlt className="text-purple-600" />}
                  count={stats.users.pharmacies}
                  label="Pharmacies"
                  bgColor="bg-purple-50"
                />
                <UserStatCard
                  icon={<FaFlask className="text-green-600" />}
                  count={stats.users.laboratories}
                  label="Laboratories"
                  bgColor="bg-green-50"
                />
                <UserStatCard
                  icon={<FaUserEdit className="text-yellow-600" />}
                  count={stats.users.dataEntry}
                  label="Data Entry"
                  bgColor="bg-yellow-50"
                />
                <UserStatCard
                  icon={<FaUserShield className="text-red-600" />}
                  count={stats.users.admins}
                  label="Admins"
                  bgColor="bg-red-50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">User Activity</h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-bold text-indigo-600">{stats.users.activeNow}</h3>
                    <p className="text-gray-500">Currently Active Users</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <FaClock className="text-indigo-600 text-2xl" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mb-2">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{width: `${(stats.users.activeNow / stats.users.totalRegistered) * 100}%`}}
                  ></div>
                </div>
                <p className="text-gray-500 text-sm">
                  {((stats.users.activeNow / stats.users.totalRegistered) * 100).toFixed(1)}% of total users
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Growth Metrics</h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-3xl font-bold text-green-600">+{stats.users.growthRate}%</h3>
                    <p className="text-gray-500">User Growth Rate (Monthly)</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaChartLine className="text-green-600 text-2xl" />
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="text-gray-600">
                    The platform is experiencing healthy growth, especially in the patient and doctor categories. 
                    Last month saw {Math.round(stats.users.totalRegistered * stats.users.growthRate / 100)} new registrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActivityCard 
                icon={<FaCalendarCheck className="text-indigo-600" />}
                title="Appointments Today"
                value={stats.activity.appointmentsToday}
                bgColor="bg-indigo-50"
                trend="+8%"
                trendUp={true}
              />
              <ActivityCard 
                icon={<FaPrescriptionBottleAlt className="text-purple-600" />}
                title="Prescriptions Issued"
                value={stats.activity.prescriptionsIssued}
                bgColor="bg-purple-50"
                trend="+5%"
                trendUp={true}
              />
              <ActivityCard 
                icon={<FaFlask className="text-blue-600" />}
                title="Lab Reports"
                value={stats.activity.labReportsGenerated}
                bgColor="bg-blue-50"
                trend="+12%"
                trendUp={true}
              />
              <ActivityCard 
                icon={<FaClipboardList className="text-green-600" />}
                title="Diagnoses"
                value={stats.activity.diagnosesRecorded}
                bgColor="bg-green-50"
                trend="+3%"
                trendUp={true}
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Performance Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700">Avg. Response Time</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Good</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.activity.averageResponseTime} sec</p>
                  <p className="text-gray-500 text-sm mt-2">Time to complete user requests</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700">Peak Activity Hour</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Info</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.activity.peakHour}</p>
                  <p className="text-gray-500 text-sm mt-2">Highest system usage time</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-700">Total Transactions</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">All Time</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.activity.totalTransactions.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm mt-2">Total system interactions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">System Uptime</h3>
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-green-100 p-3 rounded-full">
                    <FaServer className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.system.uptime}</p>
                    <p className="text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{width: '99.98%'}}></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Response Time</h3>
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-blue-100 p-3 rounded-full">
                    <FaClock className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.system.responseTime}</p>
                    <p className="text-gray-500">Average</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Rate</h3>
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-yellow-100 p-3 rounded-full">
                    <FaBug className="text-yellow-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.system.errorRate}</p>
                    <p className="text-gray-500">Last 24 hours</p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{width: '0.2%'}}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Infrastructure Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaDatabase className="text-indigo-600 mr-3" />
                      <span className="font-medium">Database Size</span>
                    </div>
                    <span className="font-bold">{stats.system.databaseSize}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaServer className="text-indigo-600 mr-3" />
                      <span className="font-medium">API Requests (24h)</span>
                    </div>
                    <span className="font-bold">{stats.system.apiRequests.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaDownload className="text-indigo-600 mr-3" />
                      <span className="font-medium">Cache Hit Rate</span>
                    </div>
                    <span className="font-bold">{stats.system.cacheHitRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Security Overview</h2>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl font-bold text-red-600">{stats.system.securityEvents}</p>
                    <p className="text-gray-500">Security Events (30 days)</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <FaShieldAlt className="text-red-600 text-2xl" />
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-2">Security Notice</h4>
                  <p className="text-gray-600 text-sm">
                    All detected events were successfully mitigated. The system employs end-to-end 
                    encryption for all patient data to ensure HIPAA compliance and data privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ContentCard
                title="Total Medical Records"
                value={stats.content.totalRecords}
                icon={<FaClipboardList className="text-indigo-600" />}
                bgColor="bg-indigo-50"
              />
              <ContentCard
                title="Total Diagnoses"
                value={stats.content.totalDiagnoses}
                icon={<FaUserMd className="text-blue-600" />}
                bgColor="bg-blue-50"
              />
              <ContentCard
                title="Total Prescriptions"
                value={stats.content.totalPrescriptions}
                icon={<FaPrescriptionBottleAlt className="text-purple-600" />}
                bgColor="bg-purple-50"
              />
              <ContentCard
                title="Total Lab Reports"
                value={stats.content.totalLabReports}
                icon={<FaFlask className="text-green-600" />}
                bgColor="bg-green-50"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Content Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-yellow-100 rounded-md mr-3">
                      <FaHospital className="text-yellow-600" />
                    </div>
                    <h3 className="font-medium">Documents Scanned</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.content.documentsScanned.toLocaleString()}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Paper to Digital</span>
                    <span>+124 this month</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-100 rounded-md mr-3">
                      <FaDatabase className="text-blue-600" />
                    </div>
                    <h3 className="font-medium">Avg. Record Size</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.content.averageRecordSize}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Storage Efficiency</span>
                    <span>-5% from last month</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-100 rounded-md mr-3">
                      <FaDownload className="text-green-600" />
                    </div>
                    <h3 className="font-medium">Data Backups</h3>
                  </div>
                  <p className="text-2xl font-bold">{stats.content.dataBackups}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Secure Offsite</span>
                    <span>Last: 2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Record Distribution</h2>
              <div className="h-12 bg-gray-100 rounded-lg overflow-hidden flex">
                <div className="h-full bg-indigo-500" style={{width: '31%'}}>
                  <div className="h-full flex items-center justify-center text-white text-xs font-medium px-2">
                    Diagnoses (31%)
                  </div>
                </div>
                <div className="h-full bg-blue-500" style={{width: '48%'}}>
                  <div className="h-full flex items-center justify-center text-white text-xs font-medium px-2">
                    Prescriptions (48%)
                  </div>
                </div>
                <div className="h-full bg-green-500" style={{width: '21%'}}>
                  <div className="h-full flex items-center justify-center text-white text-xs font-medium px-2">
                    Lab Reports (21%)
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">Distribution of {stats.content.totalRecords.toLocaleString()} total records in the system</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable components
const UserStatCard = ({ icon, count, label, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-lg flex flex-col items-center justify-center text-center`}>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-2xl font-bold">{count.toLocaleString()}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

const ActivityCard = ({ icon, title, value, bgColor, trend, trendUp }) => (
  <div className={`${bgColor} p-6 rounded-lg`}>
    <div className="flex justify-between items-center mb-4">
      <div className="p-3 bg-white rounded-full shadow-sm">
        {icon}
      </div>
      <span className={`text-sm font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
    <p className="text-gray-600">{title}</p>
  </div>
);

const ContentCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <div className={`${bgColor} p-3 rounded-full mr-4`}>
        {icon}
      </div>
      <h3 className="font-medium text-gray-700">{title}</h3>
    </div>
    <p className="text-3xl font-bold">{value.toLocaleString()}</p>
  </div>
);

export default SystemStats;
