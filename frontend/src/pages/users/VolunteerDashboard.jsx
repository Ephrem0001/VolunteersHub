import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaHeart, 
  FaShareAlt,
  FaRegClock,
  FaUsers,
  FaLeaf,
  FaBook,
  FaHeartbeat,
  FaSearch,
  FaFilter,
  FaStar,
  FaUserCircle,
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaInfoCircle,
  FaHandsHelping,
  
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { toast } from 'react-hot-toast';
import { Award, Users, Clock, Calendar, MapPin } from 'react-feather';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [user, setUser] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsAttended: 0,
    hoursVolunteered: 0,
    upcomingEvents: 0,
    impactPoints: 0
  });
  const [isScrolled, setIsScrolled] = useState(false);
  // Track scroll position for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

useEffect(() => {
  const fetchUserDataAndStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data.user);

      // Fetch stats if user exists
      if (data.user && data.user._id) {
        const statsRes = await fetch(`http://localhost:5000/api/users/${data.user._id}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      }
    } catch (error) {
      console.error("Error fetching user data or stats:", error);
      setStats({
        eventsAttended: Math.floor(Math.random() * 20),
        hoursVolunteered: Math.floor(Math.random() * 100),
        upcomingEvents: Math.floor(Math.random() * 5),
        impactPoints: Math.floor(Math.random() * 500)
      });
    }
  };

  const savedFavorites = localStorage.getItem("volunteerFavorites");
  if (savedFavorites) {
    setFavorites(JSON.parse(savedFavorites));
  }

  fetchUserDataAndStats();
}, []);
// ...existing code...

  useEffect(() => {
    localStorage.setItem("volunteerFavorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/events/approved");
        if (response.status === 429) {
          // Show a user-friendly error
          toast.error("You are making requests too quickly. Please wait and try again.");
          setLoading(false);
          return;
        }
        const data = await response.json();
        // No need to fetch volunteers count separately!
        const eventsWithDetails = data.map((event) => ({
          ...event,
          category: categorizeEvent(event.name),
          isFavorite: favorites.includes(event._id)
        }));

        setEvents(eventsWithDetails);
      } catch (error) {
        console.error("Error fetching approved events:", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedEvents();
  }, [favorites]);
// ...existing code...

  const categorizeEvent = (eventName) => {
    const lowerName = eventName.toLowerCase();
    
    if (lowerName.includes('tree') || lowerName.includes('plant') || 
        lowerName.includes('clean') || lowerName.includes('water') ||
        lowerName.includes('environment') || lowerName.includes('green')) {
      return 'environment';
    }
    
    if (lowerName.includes('education') || lowerName.includes('school') || 
        lowerName.includes('learn') || lowerName.includes('teach') ||
        lowerName.includes('workshop') || lowerName.includes('summit') ||
        lowerName.includes('empowerment') || lowerName.includes('leadership')) {
      return 'education';
    }
    
    if (lowerName.includes('health') || lowerName.includes('medical') || 
        lowerName.includes('care') || lowerName.includes('hospital') ||
        lowerName.includes('awareness') || lowerName.includes('relief')) {
      return 'health';
    }
    
    return 'other';
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.replace("/login");
    }, 1000);
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const toggleFavorite = (eventId) => {
    setFavorites(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
    toast.success(
      favorites.includes(eventId) 
        ? "Removed from favorites" 
        : "Added to favorites",
      {
        icon: favorites.includes(eventId) ? '💔' : '❤️',
        style: {
          background: favorites.includes(eventId) ? '#f43f5e' : '#10b981',
          color: '#fff',
        }
      }
    );
  };

  const handleShare = async (event) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.name,
          text: `Join me at ${event.name} - ${event.description.substring(0, 100)}...`,
          url: `${window.location.origin}/event/${event._id}`,
        });
      } else {
        const shareUrl = `${window.location.origin}/event/${event._id}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!", {
          icon: '📋',
          style: {
            background: '#3b82f6',
            color: '#fff',
          }
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const toggleEventExpand = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const registerForEvent = (eventId) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      }),
      {
        loading: 'Registering...',
        success: 'Successfully registered for event!',
        error: 'Registration failed',
      }
    );
  };

  const filteredEvents = events.filter(event => {
    if (activeFilter !== "all" && event.category !== activeFilter) return false;
    if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedDate) {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === selectedDate;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "volunteers") {
      return b.volunteersRegistered - a.volunteersRegistered;
    } else if (sortBy === "favorites") {
      return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
    }
    return 0;
  });

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'environment': return <FaLeaf className="mr-2 text-green-500" />;
      case 'education': return <FaBook className="mr-2 text-blue-500" />;
      case 'health': return <FaHeartbeat className="mr-2 text-red-500" />;
      default: return <FaHeart className="mr-2 text-purple-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'environment': return 'bg-green-100 text-green-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'health': return 'bg-red-100 text-red-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getCategoryBorder = (category) => {
    switch(category) {
      case 'environment': return 'border-green-400/30 hover:border-green-400/50';
      case 'education': return 'border-blue-400/30 hover:border-blue-400/50';
      case 'health': return 'border-red-400/30 hover:border-red-400/50';
      default: return 'border-purple-400/30 hover:border-purple-400/50';
    }
  };

  const getCategoryText = (category) => {
    switch(category) {
      case 'environment': return 'text-green-400 hover:text-green-300';
      case 'education': return 'text-blue-400 hover:text-blue-300';
      case 'health': return 'text-red-400 hover:text-red-300';
      default: return 'text-purple-400 hover:text-purple-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 flex flex-col">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`fixed w-full z-50 p-4 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-4'}`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4 }}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 p-2 rounded-lg"
            >
              <FaHandsHelping className="text-white text-xl" />
            </motion.div>
            <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              VolunteerHub
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full bg-white shadow-sm hover:bg-gray-100"
              onClick={() => setShowNotification(!showNotification)}
            >
              <FaBell className="text-gray-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </motion.button>
            
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-white hover:bg-gray-100 px-3 py-2 rounded-full shadow-sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-teal-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden md:inline font-medium text-gray-700">{user?.name || "User"}</span>
                {showProfileMenu ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </motion.button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200"
                  >
                    <div className="py-1">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => navigate("/profile")}
                      >
                        Your Profile
                      </button>
                     
                      <div className="border-t border-gray-200"></div>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-lg text-gray-800">Notifications</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowNotification(false)}
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {[
                { id: 1, title: "New event near you", message: "Tree planting this weekend", time: "2h ago", read: false, icon: "🌱" },
                { id: 2, title: "Registration confirmed", message: "You're signed up for the beach cleanup", time: "1d ago", read: true, icon: "🏖️" },
                { id: 3, title: "Volunteer spotlight", message: "You've been featured for your contributions", time: "3d ago", read: true, icon: "🌟" },
                { id: 4, title: "Impact milestone", message: "You've reached 50 volunteer hours!", time: "1w ago", read: true, icon: "🏆" }
              ].map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{notification.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
                      </div>
                      {!notification.read && (
                        <button className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer border-t border-gray-200 bg-gray-50">
              View All Notifications
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex-grow flex flex-col items-center pt-24 pb-8 px-4 md:px-8 space-y-8"
      >
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl w-full"
        >
          <div className="relative inline-block">
            <motion.h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-4">
              Welcome back, {user?.name || "Volunteer"}!
            </motion.h2>
            <motion.span 
              className="absolute -top-6 -right-8 text-4xl" 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3 }}
            >
             
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mt-4 leading-relaxed max-w-3xl mx-auto"
          >
            Your passion fuels change. Discover meaningful opportunities to contribute 
            your time and skills to causes that need you most.
          </motion.p>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
          >
            {[
              { 
                title: "Events Attended", 
                value: stats.eventsAttended, 
                icon: <Calendar className="text-blue-500" />,
                color: "bg-blue-50",
                textColor: "text-blue-600"
              },
              { 
                title: "Hours Volunteered", 
                value: stats.hoursVolunteered, 
                icon: <Clock className="text-green-500" />,
                color: "bg-green-50",
                textColor: "text-green-600"
              },
              { 
                title: "Upcoming Events", 
                value: stats.upcomingEvents, 
                icon: <Users className="text-purple-500" />,
                color: "bg-purple-50",
                textColor: "text-purple-600"
              },
              { 
                title: "Impact Points", 
                value: stats.impactPoints, 
                icon: <Award className="text-amber-500" />,
                color: "bg-amber-50",
                textColor: "text-amber-600"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`${stat.color} p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-white shadow-sm">
                    {stat.icon}
                  </div>
                </div>
                <motion.div 
                  className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  <div className={`h-full ${stat.textColor.replace('text', 'bg')} opacity-30`}></div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Search and Filter Bar */}
          <div className="mt-8 w-full flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by name, location, or category..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-400 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => setShowFilters(!showFilters)}
  className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 shadow-sm"
>
  <FaFilter className="text-gray-600" /> 
  {showFilters ? "Hide" : "Show"} Filters
</motion.button>
              
              <select
                className="bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.5rem] bg-[length:1rem]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="volunteers">Sort by Volunteers</option>
                <option value="favorites">Sort by Favorites</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <select
                    className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="environment">🌱 Environment</option>
                    <option value="education">📚 Education</option>
                    <option value="health">❤️ Health</option>
                    <option value="other">✨ Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
                  <input
                    type="date"
                    className="w-full bg-white border border-gray-300 text-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2 flex items-end space-x-4">
                  <Button 
                    onClick={() => {
                      setActiveFilter("all");
                      setSearchQuery("");
                      setSelectedDate("");
                      setSortBy("date");
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg text-gray-800"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-teal-600 hover:bg-teal-700 px-4 py-3 rounded-lg text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Quick Filters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            {[
              { name: 'All Events', value: 'all', emoji: '🌟', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
              { name: 'Environment', value: 'environment', emoji: '🌱', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
              { name: 'Education', value: 'education', emoji: '📚', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
              { name: 'Health', value: 'health', emoji: '❤️', color: 'bg-red-100 text-red-800 hover:bg-red-200' }
            ].map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center ${
                  activeFilter === filter.value 
                    ? `${filter.color.replace('hover:', '')} shadow-md ring-2 ring-offset-2 ${filter.value === 'all' ? 'ring-purple-300' : filter.value === 'environment' ? 'ring-green-300' : filter.value === 'education' ? 'ring-blue-300' : 'ring-red-300'}` 
                    : `${filter.color} shadow-sm`
                }`}
              >
                <span className="mr-2">{filter.emoji}</span>
                {filter.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Event List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 w-full bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800">No matching events found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            <Button 
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
                setSelectedDate("");
              }}
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white"
            >
              Reset Filters
            </Button>
          </motion.div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border ${getCategoryBorder(event.category)} transition-all duration-300`}
              >
                  <Card className="h-full flex flex-col">
                    {/* Event Image with Favorite Button */}
                    <div className="relative overflow-hidden h-56">
                      <div 
                        className="absolute inset-0 z-10 cursor-pointer" 
                        onClick={() => handleEventClick(event._id)}
                        aria-label={`View details for ${event.name}`}
                      />
                      
                      <img
                        src={event.image || 'https://source.unsplash.com/random/600x400/?volunteer'}
                        alt={event.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://source.unsplash.com/random/600x400/?volunteer';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event._id);
                        }}
                        className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full hover:bg-yellow-100 transition-colors shadow-md"
                      >
                        <FaStar className={event.isFavorite ? "text-yellow-400" : "text-gray-400"} />
                      </button>
                      
                      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
                        <div className={`${getCategoryColor(event.category)} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
                          {getCategoryIcon(event.category)}
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </div>
                        <div className="bg-gray-800/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <FaUsers className="mr-1" /> {event.volunteers} joined                        </div>
                      </div>
                    </div>

                    <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="p-6 flex-grow flex flex-col"
                >
                  {/* ...existing event content... */}
                  <AnimatePresence>
                    {expandedEvent === event._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-gray-50 rounded-lg mt-2"
                      >
                        <div className="p-4 space-y-3 text-gray-600 text-sm">
                          <div className="flex items-start">
                            <FaInfoCircle className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-700">Details:</p>
                              <p>{event.longDescription || "No additional details provided."}</p>
                            </div>
                          </div>
                          {event.requirements?.length > 0 && (
                            <div className="flex items-start">
                              <FaHandsHelping className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-700">Requirements:</p>
                                <ul className="list-disc list-inside pl-1">
                                  {event.requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaUsers className="mr-2" />
                        {/* <span>{event.volunteersRegistered} of {event.volunteersNeeded || '∞'} spots filled</span> */}
                        <span>{event.name}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEventExpand(event._id);
                        }}
                        className="text-teal-600 hover:text-teal-800 flex items-center text-sm font-medium"
                      >
                        {expandedEvent === event._id ? (
                          <>
                            <span className="mr-1">Less info</span>
                            <FaChevronUp />
                          </>
                        ) : (
                          <>
                            <span className="mr-1">More info</span>
                            <FaChevronDown />
                          </>
                        )}
                      </button>
                    </div>
                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-between mt-4"
                      >
                       <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="text-gray-600 hover:text-gray-800 flex items-center group"
  onClick={(e) => {
    e.stopPropagation();
    handleShare(event);
  }}
>
  <FaShareAlt className="mr-2 group-hover:animate-bounce" /> 
  <span className="text-sm">Share</span>
</motion.button>

                        
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
  onClick={(e) => {
    e.stopPropagation();
    handleEventClick(event._id);
  }}
>
  View Event
</motion.button>
                      </motion.div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Create Event Button (Floating) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-4 rounded-full shadow-xl z-40 flex items-center justify-center"
        onClick={() => navigate("/create-event")}
      >
        <FaPlus className="text-xl" />
        <motion.span 
          className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-800"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          +
        </motion.span>
      </motion.button>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white border-t border-gray-200 text-gray-600 py-12"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold text-teal-600 mb-4 flex items-center">
                <FaHandsHelping className="mr-2" />
                VolunteerHub
              </h4>
              <p className="text-sm mb-4">
                Connecting compassionate individuals with meaningful opportunities to create positive change in communities worldwide.
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-4">For Volunteers</h5>
              <ul className="space-y-2">
                {['Browse Events', 'Organizations', 'Success Stories', 'Volunteer Resources'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-teal-600 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-4">For Organizations</h5>
              <ul className="space-y-2">
                {['Create Events', 'Manage Volunteers', 'Success Stories', 'Organization Resources'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-teal-600 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-800 mb-4">Company</h5>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Press', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-teal-600 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} VolunteerHub. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-xs hover:text-teal-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs hover:text-teal-600 transition-colors">Terms of Service</a>
              <a href="#" className="text-xs hover:text-teal-600 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default VolunteerDashboard;