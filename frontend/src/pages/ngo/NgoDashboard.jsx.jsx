import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSignOutAlt, FaHandsHelping, FaUsers, FaBullhorn, 
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram,
  FaChartLine, FaCalendarAlt, FaUserCog, FaArrowRight,
  FaBell, FaEnvelope, FaLock, FaEye, FaEyeSlash
} from "react-icons/fa";
import { MdEventAvailable, MdDashboard } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";
import { FaChevronDown, FaChevronUp, FaUserCircle } from "react-icons/fa";
import { toast } from 'react-hot-toast';

const NgoDashboard = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    events: 0,
    volunteers: 0,
    retention: "0%",
    hours: "0"
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [ngo, setNgo] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    email: "",
    organization: "",
    description: "" 
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

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Simulate API calls with mock data
        const mockStats = {
          events: 24,
          volunteers: 156,
          retention: "89%",
          hours: "1.2k"
        };

        const mockNotifications = [
          { id: 1, message: "New volunteer signed up for your event", read: false, timestamp: "2 mins ago" },
          { id: 2, message: "Event 'Clean the Park' approved", read: false, timestamp: "1 hour ago" },
          { id: 3, message: "Monthly volunteer report is ready", read: true, timestamp: "1 day ago" }
        ];

        setStats(mockStats);
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();

    // Set up real-time updates (simulated with interval)
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        volunteers: prev.volunteers + Math.floor(Math.random() * 3)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  // Fetch NGO profile
  useEffect(() => {
    const fetchNgo = async () => {
      try {
        const token = localStorage.getItem("token");
       const res = await fetch("http://localhost:5000/api/auth/profile/update", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    name: editForm.name,
    email: editForm.email,
    organization: editForm.organization,
    description: editForm.description
  })
});
        const data = await res.json();
        setNgo(data.ngo);
        setEditForm({ 
          name: data.ngo?.name || "", 
          email: data.ngo?.email || "",
          organization: data.ngo?.organization || "",
          description: data.ngo?.description || "" 
        });
      } catch (err) {
        setNgo(null);
      }
    };
    fetchNgo();
  }, []);
   
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setShowEditProfile(false);
        setNgo({ ...ngo, ...editForm });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
    const res = await fetch("https://volunteershub-6.onrender.com/api/auth/profile/update", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword
  })
});

      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully!");
        setShowChangePassword(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => prev - 1);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const dashboardCards = [
    {
      icon: <MdEventAvailable className="text-4xl text-purple-400" />,
      title: "Create Event",
      description: "Plan and organize new volunteer opportunities",
      path: "/ngo/create-event",
      gradient: "from-purple-600 to-indigo-600"
    },
    {
      icon: <FaCalendarAlt className="text-4xl text-blue-400" />,
      title: "Manage Events",
      description: "View and edit your upcoming events",
      path: "/ngo/manage-events",
      gradient: "from-blue-600 to-teal-600"
    },
    {
      icon: <FaUsers className="text-4xl text-green-400" />,
      title: "Volunteers",
      description: "Track and manage your volunteers",
      path: "/users/track-volunteers",
      gradient: "from-green-600 to-emerald-600"
    },
   
    {
      icon: <IoMdAnalytics className="text-4xl text-red-400" />,
      title: "Analytics",
      description: "View your organization's impact",
      path: "/analytics/dashboard",
      gradient: "from-red-600 to-pink-600"
    },
  ];

  const quickStats = [
    { value: stats.events, label: "Upcoming Events", icon: <FaCalendarAlt className="text-purple-400" /> },
    { value: stats.volunteers, label: "Active Volunteers", icon: <FaUsers className="text-blue-400" /> },
    { value: stats.retention, label: "Retention Rate", icon: <FaChartLine className="text-green-400" /> },
    { value: stats.hours, label: "Total Hours", icon: <FaHandsHelping className="text-yellow-400" /> }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating decorative elements */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-500 opacity-10"
          style={{
            width: Math.random() * 100 + 50 + 'px',
            height: Math.random() * 100 + 50 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 100],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}

      {/* Navbar */}
      <motion.nav
        className="bg-gray-800/80 backdrop-blur-lg p-5 flex justify-between items-center border-b border-purple-500/30 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Left side - Empty or you can add other elements if needed */}
        <div></div>

        {/* Right side - Profile menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 bg-white hover:bg-gray-100 px-3 py-2 rounded-full shadow-sm"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {ngo?.logo ? (
              <img src={ngo.logo} alt="Logo" className="w-8 h-8 rounded-full object-cover border-2 border-purple-500" />
            ) : (
              <FaUserCircle className="w-8 h-8 text-purple-500" />
            )}
            <span className="hidden md:inline font-medium text-gray-700">{ngo?.name || "NGO"}</span>
            {showProfileMenu ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
          </motion.button>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {ngo?.logo ? (
                      <img src={ngo.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border-2 border-purple-500" />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-purple-500" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{ngo?.name || "NPOs"}</h4>
                      <p className="text-xs text-gray-500">{ngo?.email || ""}</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">

<button
  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
  onClick={async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://volunteershub-6.onrender.com/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEditForm({
        name: data.user?.name || "",
        email: data.user?.email || "",
        organization: data.user?.organization || "",
      });
      setShowEditProfile(true);
      setShowProfileMenu(false);
    } catch {
      toast.error("Failed to load profile info");
    }
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
                  
                  <div className="border-t border-gray-200"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

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
                    <label className="block mb-2 text-sm font-medium text-gray-700">Organization Name</label>
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

      {/* Change Password Modal */}
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
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        className="w-full border px-3 py-2 rounded mb-1 text-gray-800 pr-10"
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
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
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        className="w-full border px-3 py-2 rounded mb-1 text-gray-800 pr-10"
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                        required
                        minLength={6}
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
                  
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        className="w-full border px-3 py-2 rounded mb-1 text-gray-800 pr-10"
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                        required
                        minLength={6}
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
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded bg-purple-600 text-white"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="md:hidden bg-gray-800/90 backdrop-blur-lg border-b border-gray-700/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 grid grid-cols-2 gap-4">
              {dashboardCards.slice(0, 4).map((item, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${item.gradient} p-4 rounded-xl shadow-lg cursor-pointer`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(item.path);
                    setShowMobileMenu(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/10 rounded-lg">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        className="flex-grow p-6 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            Welcome Back, Organization!
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Manage your volunteers, create impactful events, and track your organization's progress all in one place.
          </p>
        </motion.div>

        {/* Dashboard Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {dashboardCards.map((item, index) => (
            <motion.div
              key={index}
              className={`bg-gradient-to-br ${item.gradient} p-6 rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300`}
              whileHover={{ y: -5, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <p className="text-gray-100">{item.description}</p>
              <motion.div 
                className="mt-4 text-right"
                whileHover={{ x: 5 }}
              >
                <button className="text-white/80 hover:text-white transition-colors">
                  <FaArrowRight />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="bg-gray-800/80 backdrop-blur-lg border-t border-gray-700/50 py-8 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg">
                <FaHandsHelping className="text-xl text-white" />
              </div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                VolunteersHub
              </h3>
            </div>
            
            <div className="flex space-x-6">
              {[
                { icon: FaFacebook, color: "hover:text-blue-400", label: "Facebook" },
                { icon: FaTwitter, color: "hover:text-sky-400", label: "Twitter" },
                { icon: FaLinkedin, color: "hover:text-blue-500", label: "LinkedIn" },
                { icon: FaInstagram, color: "hover:text-pink-400", label: "Instagram" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`text-gray-400 ${social.color} transition-colors`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </div>
          
          <motion.div 
            className="mt-8 pt-6 border-t border-gray-700/50 text-center text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            <p>&copy; {new Date().getFullYear()} VolunteersHub. All rights reserved.</p>
            <p className="mt-2">Empowering communities through volunteerism</p>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default NgoDashboard;