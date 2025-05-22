import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Pie } from 'react-chartjs-2';
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
  FaBell,
  FaEnvelope,
  FaUserCog,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import ManageNGO from "./ManageNGO";
import ManageVolunteer from "./ManageVolunteer";
import ApproveEvents from "./ApproveEvents";
import ApprovedEvents from "./ApprovedEvents";
import RejectedEvents from "./RejectedEvents";
import ContactMessages from './ContactMessages';
import { toast } from 'react-hot-toast';

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
  const [users, setUsers] = useState([]);
const [events, setEvents] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    uptime: "99.9%",
    lastBackup: "2 hours ago",
    activeSessions: 142,
  });

  // Profile states
  const [admin, setAdmin] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const navigate = useNavigate();

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching admin profile with token:", token ? "Token exists" : "No token");
        
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Admin profile response status:", res.status);
        
        if (!res.ok) {
          console.log("Admin profile fetch failed, using stored user data");
          // If profile endpoint fails, use localStorage data
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          if (storedUser && storedUser._id) {
            console.log("Using stored user data:", storedUser);
            setAdmin(storedUser);
            setEditForm({
              name: storedUser?.name || "",
              email: storedUser?.email || "",
              role: storedUser?.role || "admin"
            });
            return;
          }
          
          throw new Error("Failed to load admin profile");
        }
        
        const data = await res.json();
        setAdmin(data.user);
        setEditForm({
          name: data.user?.name || "",
          email: data.user?.email || "",
          role: data.user?.role || "admin"
        });
      } catch (err) {
        console.error("Admin profile fetch error:", err);
        toast.error("Failed to load admin profile");
      }
    };
    fetchAdminProfile();
  }, []);

  // In AdminDashboard.jsx

// Fetch all events
useEffect(() => {
  const fetchAllEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  fetchAllEvents();
}, []);

// Fetch pending events when tab is active
useEffect(() => {
  const fetchPendingEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/events/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPendingEvents(data);
    } catch (error) {
      console.error("Error fetching pending events:", error);
    }
  };

  if (activeTab === "approve-events") {
    fetchPendingEvents();
  }
}, [activeTab]);
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch users
      const usersResponse = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      // Fetch events
      const eventsResponse = await fetch("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);
 const handleLogout = () => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully");
  setTimeout(() => {
    navigate("/login", { replace: true });
  }, 1000);
};

  // Edit Profile
// Updated handleProfileUpdate function
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/api/admin/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        name: editForm.name,
        email: editForm.email
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    toast.success("Profile updated!");
    setAdmin(data.user);
    setShowEditProfile(false);
  } catch (err) {
    toast.error(err.message || "Update failed");
    console.error("Update error:", err);
  }
};
const handlePasswordChange = async (e) => {
  e.preventDefault();
  
  // Frontend validation
  if (passwordForm.newPassword.length < 8) {
    window.alert("Password must be at least 8 characters");
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    window.alert("New passwords don't match!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/admin/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      window.alert(data.message || "Failed to change password");
      return;
    }

    window.alert("Password changed successfully!");
    setShowChangePassword(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

  } catch (err) {
    window.alert(err.message || "Failed to change password");
  }
};

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
    { key: "manage-npo", icon: FaUserShield, label: "Manage NPOs" },
    { key: "manage-volunteer", icon: FaUsers, label: "Manage Volunteers" },
    { key: "approve-events", icon: FaRegCalendarCheck, label: "Pending Events" },
    { key: "approved-events", icon: FaCheck, label: "Approved Events" },
    { key: "rejected-events", icon: FaRegCalendarTimes, label: "Rejected Events" },
    { key: "analytics", icon: FaChartLine, label: "Analytics" },
    { key: "contact-messages", icon: FaEnvelope, label: "Contact Messages" },
    
  ];

  const tabTitles = {
    "manage-npo": "NPO Management",
    "manage-volunteer": "Volunteer Management",
    "approve-events": "Pending Event Approvals",
    "approved-events": "Approved Events",
    "rejected-events": "Rejected Events",
    "contact-messages": "Contact Messages",
    "analytics": "System Analytics",
    
  };
{activeTab === "manage-ngo" && <ManageNGO users={users} />}
{activeTab === "manage-volunteer" && <ManageVolunteer users={users} />}
{activeTab === "approve-events" && (
  <ApproveEvents 
    events={pendingEvents} 
    setEvents={setPendingEvents} 
  />
)}
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

  // StatCard, AnalyticsDashboard, SettingsPanel
const StatCard = ({ title, value, change, icon }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-start"
  >
    <div className="mr-4 p-3 rounded-lg bg-opacity-20 bg-indigo-100">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm mt-1 ${change && change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
        {change} from last month
      </p>
    </div>
  </motion.div>
);

const AnalyticsDashboard = () => {
  // Sample data for charts
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 59, 80, 81, 56, 72],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const eventStatusData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'User Logins',
        data: [320, 420, 510, 480, 530, 410, 390],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2
      },
      {
        label: 'Event Actions',
        data: [120, 190, 230, 210, 250, 180, 150],
        backgroundColor: 'rgba(20, 184, 166, 0.5)',
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">User Growth</h3>
          <Bar 
            data={userGrowthData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-lg mb-4">Event Status</h3>
          <div className="h-64 flex items-center justify-center">
            <Pie 
              data={eventStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h3 className="font-semibold text-lg mb-4">Weekly Activity</h3>
        <Bar 
          data={activityData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>

     
    </div>
  );
};

 
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Edit Profile Modal */}
<AnimatePresence>
  {showEditProfile && (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleProfileUpdate}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
              <input
                className="w-full border px-3 py-2 rounded mb-1 text-gray-800"
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded mb-1 text-gray-800"
                value={editForm.email}
                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            {/* Removed Role field */}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-800"
              onClick={() => setShowEditProfile(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-purple-600 text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )}
</AnimatePresence>

   <AnimatePresence>
  {showChangePassword && (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          {/* Current Password Field */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                className="w-full border px-3 py-2 rounded mb-1 text-gray-800 pr-10"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  currentPassword: e.target.value
                }))}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              New Password (min 8 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                className="w-full border px-3 py-2 rounded mb-1 text-gray-800 pr-10"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  newPassword: e.target.value
                }))}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                className="w-full border px-3 py-2 rounded mb-1 text-gray-800 pr-10"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({
                  ...prev,
                  confirmPassword: e.target.value
                }))}
                required
                minLength={8}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-800"
              onClick={() => {
                setShowChangePassword(false);
                setPasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: ""
                });
                toast.dismiss(); // Clear any existing messages
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )}
</AnimatePresence>

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
        {/* Sidebar Footer */}
        <div className="mt-auto pt-4 border-t border-gray-700">
       
        
          {/* Logout Button */}
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
                {activeTab === "contact-messages" && "View and manage all contact form submissions"}
               
              </p>
            </div>
            {/* Top right admin profile dropdown */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? "◀" : "▶"}
              </motion.button>
              {/* Admin profile dropdown */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 bg-white border rounded-full px-3 py-1 shadow hover:bg-gray-100 transition"
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                >
                  {admin?.avatar ? (
                    <img src={admin.avatar} alt="Admin" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-gray-500" />
                  )}
                  <span className="font-medium text-gray-700">{admin?.name || "Admin"}</span>
                  {showProfileMenu ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                          setEditForm({
                            name: admin?.name || "",
                            email: admin?.email || "",
                            role: admin?.role || ""
                          });
                          setShowEditProfile(true);
                          setShowProfileMenu(false);
                        }}
                      >
                        <FaUserCog className="text-purple-500" />
                        <span>Edit Profile</span>
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: ""
                          });
                          setShowChangePassword(true);
                          setShowProfileMenu(false);
                        }}
                      >
                        <FaLock className="text-purple-500" />
                        <span>Change Password</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Content */}
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
      {activeTab === "manage-ngo" && <ManageNGO users={users} />}
     {activeTab === "manage-volunteer" && (
  <ManageVolunteer 
    users={users} 
    setUsers={setUsers} 
  />
)}
     

{activeTab === "approve-events" && (
  <ApproveEvents 
    events={pendingEvents} 
    setEvents={setPendingEvents} 
    refreshEvents={() => {
      // This will trigger a refetch when events are approved/rejected
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/events/pending", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setPendingEvents(data));
    }}
  />
)}

      {activeTab === "approved-events" && <ApprovedEvents />}
      {activeTab === "rejected-events" && <RejectedEvents />}
      {activeTab === "contact-messages" && <ContactMessages />}
      {activeTab === "analytics" && <AnalyticsDashboard />}
    </div>
  </motion.div>
</AnimatePresence>
          {/* Stats Cards */}
         {/* Stats Cards */}
{activeTab !== "analytics" && activeTab !== "settings" && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
    

  </div>
)}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;