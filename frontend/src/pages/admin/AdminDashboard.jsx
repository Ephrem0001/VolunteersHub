import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    window.location.replace("/login");
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
      className="bg-white p-6 rounded-lg shadow border border-gray-100"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className={`text-sm mt-1 ${change && change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change} from last month
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const AnalyticsDashboard = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Active Users" value="1,200" change="+12%" icon={<FaUsers className="text-indigo-500" />} />
        <StatCard title="Events Created" value="320" change="+24%" icon={<FaRegCalendarCheck className="text-purple-500" />} />
      </div>
      {/* Add more analytics as needed */}
    </div>
  );

 
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
        {/* Sidebar Footer */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          {/* Admin Login Button */}
        
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
                {activeTab === "settings" && "Configure system settings"}
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
                {activeTab === "contact-messages" && <ContactMessages />}
                {activeTab === "analytics" && <AnalyticsDashboard />}
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
                    <p className="text-sm opacity-80">Total NPOs</p>
                    <p className="text-3xl font-bold">14</p>
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