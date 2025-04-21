import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import {
  FaUsers,
  FaRegClipboard,
  FaCheck,
  FaTimes,
  FaSignOutAlt,
  FaChartLine,
  FaUserShield,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
  FaCog,
  FaBell
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import ManageNGO from "./ManageNGO";
import ManageVolunteer from "./ManageVolunteer";
import ApproveEvents from "./ApproveEvents";
import ApprovedEvents from "./ApprovedEvents";
import RejectedEvents from "./RejectedEvents";

// Register Chart.js components
Chart.register(...registerables);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("manage-ngo");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    activeUsers: 0,
    eventsCreated: 0,
    volunteerHours: 0,
    ngoGrowth: 0,
  });
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    autoApproveThreshold: 50,
    maintenanceMode: false,
  });
  const [systemStatus, setSystemStatus] = useState({
    uptime: "99.9%",
    lastBackup: "2 hours ago",
    activeSessions: 142,
  });

  const storedRole = localStorage.getItem("user");
  console.log(storedRole)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    window.location.replace("/login");
  };

  const fetchAnalyticsData = () => {
    setTimeout(() => {
      setAnalyticsData({
        activeUsers: Math.floor(Math.random() * 500) + 500,
        eventsCreated: Math.floor(Math.random() * 200) + 100,
        volunteerHours: Math.floor(Math.random() * 5000) + 3000,
        ngoGrowth: Math.floor(Math.random() * 20) + 5,
      });
    }, 800);
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleThresholdChange = (e) => {
    setSettings(prev => ({
      ...prev,
      autoApproveThreshold: e.target.value
    }));
  };

  const runSystemBackup = () => {
    setTimeout(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastBackup: "Just now"
      }));
    }, 2000);
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData();
    }
  }, [activeTab]);

  const tabs = [
    { key: "manage-ngo", icon: FaUserShield, label: "Manage NGOs" },
    { key: "manage-volunteer", icon: FaUsers, label: "Manage Volunteers" },
    { key: "approve-events", icon: FaRegCalendarCheck, label: "Pending Events" },
    { key: "approved-events", icon: FaCheck, label: "Approved Events" },
    { key: "rejected-events", icon: FaRegCalendarTimes, label: "Rejected Events" },
    { key: "analytics", icon: FaChartLine, label: "Analytics" },
    { key: "settings", icon: FaCog, label: "Settings" }
  ];

  const tabTitles = {
    "manage-ngo": "NGO Management",
    "manage-volunteer": "Volunteer Management",
    "approve-events": "Pending Event Approvals",
    "approved-events": "Approved Events",
    "rejected-events": "Rejected Events",
    "analytics": "System Analytics",
    "settings": "Admin Settings"
  };

  const SidebarLink = ({ tabKey, icon: Icon, label }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center px-5 py-3 rounded-lg cursor-pointer transition-all mb-2 ${
        activeTab === tabKey
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
      onClick={() => setActiveTab(tabKey)}
    >
      <Icon className="mr-3 text-lg" />
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  );

  const AnalyticsDashboard = () => {
    // Static data that won't change infinitely
    const userGrowthData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'New Volunteers',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1,
          tension: 0.1 // Smooth line
        },
        {
          label: 'New NGOs',
          data: [28, 48, 40, 19, 86, 27],
          backgroundColor: 'rgba(139, 92, 246, 0.6)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 1,
          tension: 0.1 // Smooth line
        }
      ]
    };
  
    // Properly structured event status data as bar chart
    const eventStatusData = {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [{
        label: 'Event Count',
        data: [120, 45, 30], // Fixed values
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    };
  
    // Common chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: '5%' // Adds padding
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true
        }
      }
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Users" 
            value={analyticsData.activeUsers} 
            change="+12%"
            icon={<FaUsers className="text-indigo-500" />}
          />
          <StatCard 
            title="Events Created" 
            value={analyticsData.eventsCreated} 
            change="+24%"
            icon={<FaRegCalendarCheck className="text-purple-500" />}
          />
          <StatCard 
            title="Volunteer Hours" 
            value={analyticsData.volunteerHours} 
            change="+8%"
            icon={<FaChartLine className="text-blue-500" />}
          />
          <StatCard 
            title="NGO Growth" 
            value={`${analyticsData.ngoGrowth}%`} 
            change="+3%"
            icon={<FaUserShield className="text-teal-500" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">User Growth</h3>
          <div className="h-[300px]">
            <Bar 
              data={userGrowthData} 
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Number of Users'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Event Status Chart - Now using Bar chart instead of Pie */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Event Status</h3>
          <div className="h-[300px]">
          <Bar 
              data={eventStatusData} 
              options={{
                ...chartOptions,
                indexAxis: 'y', // Horizontal bars
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Status'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Number of Events'
                    }
                  }
                }
              }} 
            />
             </div>
        </div>
      </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { id: 1, action: "New NGO registration", time: "5 mins ago", status: "pending" },
              { id: 2, action: "Event approved", time: "23 mins ago", status: "approved" },
              { id: 3, action: "Volunteer account created", time: "1 hour ago", status: "completed" },
              { id: 4, action: "System maintenance", time: "2 hours ago", status: "warning" },
            ].map(item => (
              <div key={item.id} className="flex items-center p-3 border-b border-gray-100 last:border-0">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  item.status === 'approved' ? 'bg-green-500' : 
                  item.status === 'pending' ? 'bg-yellow-500' :
                  item.status === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SettingsPanel = () => {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Appearance</h3>
            <div className="space-y-4">
            <ToggleSetting
  label="Dark Mode"
  checked={settings.darkMode}
  onChange={() => toggleSetting('darkMode')}
  icon={FaCog}  // Pass the component reference, not JSX
/>
<ToggleSetting
  label="Notifications"
  checked={settings.notifications}
  onChange={() => toggleSetting('notifications')}
  icon={FaBell}
/>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Approval Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-approve threshold: {settings.autoApproveThreshold}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.autoApproveThreshold}
                  onChange={handleThresholdChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Events with rating above this threshold will be auto-approved
                </p>
              </div>
              <ToggleSetting
  label="Maintenance Mode"
  checked={settings.maintenanceMode}
  onChange={() => toggleSetting('maintenanceMode')}
  icon={FaUserShield}
  warning
/>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">Uptime</p>
              <p className="text-2xl font-bold">{systemStatus.uptime}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">Last Backup</p>
              <p className="text-2xl font-bold">{systemStatus.lastBackup}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500">Active Sessions</p>
              <p className="text-2xl font-bold">{systemStatus.activeSessions}</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runSystemBackup}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Run Backup Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              View Logs
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, change, icon }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg shadow border border-gray-100"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className={`text-sm mt-1 ${
            change.startsWith('+') ? 'text-green-500' : 'text-red-500'
          }`}>
            {change} from last month
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const ToggleSetting = ({ label, checked, onChange, icon: Icon, warning = false }) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center ${
          warning ? 'bg-red-100 text-red-500' : 'bg-indigo-100 text-indigo-500'
        }`}>
          <Icon className="text-lg" />  {/* Render the icon component */}
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
      </label>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col shadow-2xl z-20 fixed h-full`}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center"
            >
              <RiAdminFill className="text-3xl text-purple-400 mr-2" />
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                Admin Portal
              </h2>
            </motion.div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white p-1"
            >
              {isSidebarOpen ? "◀" : "▶"}
            </button>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <SidebarLink 
                key={tab.key} 
                tabKey={tab.key} 
                icon={tab.icon} 
                label={tab.label} 
              />
            ))}
          </nav>
        </div>

        {/* User & Logout */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center mb-4 p-3 rounded-lg bg-gray-700/50">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
              <span className="font-bold">A</span>
            </div>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-gray-400">Super Admin</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center justify-center w-full bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all text-white shadow-lg"
          >
            <FaSignOutAlt className="mr-2" />
            <span className="text-sm font-semibold">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}
      >
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {tabTitles[activeTab] || "Dashboard"}
              </h1>
              <p className="text-gray-500">
                {activeTab === "manage-ngo" && "Manage all registered NGOs"}
                {activeTab === "manage-volunteer" && "Manage volunteer accounts"}
                {activeTab === "approve-events" && "Review and approve pending events"}
                {activeTab === "approved-events" && "View all approved events"}
                {activeTab === "rejected-events" && "View rejected events"}
                {activeTab === "analytics" && "System usage statistics"}
                {activeTab === "settings" && "Configure system settings"}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? "◀" : "▶"}
              </motion.button>
            </div>
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                {activeTab === "manage-ngo" && <ManageNGO />}
                {activeTab === "manage-volunteer" && <ManageVolunteer />}
                {activeTab === "approve-events" && <ApproveEvents />}
                {activeTab === "approved-events" && <ApprovedEvents />}
                {activeTab === "rejected-events" && <RejectedEvents />}
                {activeTab === "analytics" && <AnalyticsDashboard />}
                {activeTab === "settings" && <SettingsPanel />}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Cards */}
          {activeTab !== "analytics" && activeTab !== "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Total NGOs</p>
                    <p className="text-3xl font-bold">142</p>
                  </div>
                  <FaUserShield className="text-4xl opacity-30" />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Total Volunteers</p>
                    <p className="text-3xl font-bold">1,842</p>
                  </div>
                  <FaUsers className="text-4xl opacity-30" />
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Pending Events</p>
                    <p className="text-3xl font-bold">23</p>
                  </div>
                  <FaRegClipboard className="text-4xl opacity-30" />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;