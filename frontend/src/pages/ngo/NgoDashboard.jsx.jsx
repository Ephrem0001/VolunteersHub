import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSignOutAlt, FaHandsHelping, FaUsers, FaBullhorn, 
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram,
  FaChartLine, FaCalendarAlt, FaUserCog, FaArrowRight,
  FaBell, FaEnvelope
} from "react-icons/fa";
import { MdEventAvailable, MdDashboard } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { IoMdAnalytics } from "react-icons/io";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/login");
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
      icon: <RiTeamFill className="text-4xl text-yellow-400" />,
      title: "Teams",
      description: "Organize volunteers into teams",
      path: "/ngo/teams",
      gradient: "from-yellow-600 to-amber-600"
    },
    {
      icon: <IoMdAnalytics className="text-4xl text-red-400" />,
      title: "Analytics",
      description: "View your organization's impact",
      path: "/analytics/dashboard",
      gradient: "from-red-600 to-pink-600"
    },
    // {
    //   icon: <FaUserCog className="text-4xl text-cyan-400" />,
    //   title: "Settings",
    //   description: "Manage your organization profile",
    //   path: "/ngo/ngo-settings",
    //   gradient: "from-cyan-600 to-sky-600"
    // }
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
        <div className="flex items-center justify-between w-full">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
          >
            <button 
              className="md:hidden text-white mr-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <motion.div
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaHandsHelping className="text-2xl text-white" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              NGO Dashboard
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <motion.button
                className="p-2 rounded-full hover:bg-gray-700/50 relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    className="absolute right-0 mt-2 w-72 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          className="text-xs text-purple-400 hover:text-purple-300"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`p-3 border-b border-gray-700/50 hover:bg-gray-700/50 cursor-pointer ${!notification.read ? 'bg-gray-700/30' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-400">
                          No notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSignOutAlt className="text-lg" /> 
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

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

        {/* Quick Stats Section */}
        <motion.section
          className="mt-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MdDashboard className="text-purple-400" /> Quick Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50 hover:border-purple-400/30 transition-all"
                whileHover={{ y: -3 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-600/30 rounded-lg">
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-gray-300 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
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