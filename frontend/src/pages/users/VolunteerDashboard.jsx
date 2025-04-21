import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaComment, 
  FaSignOutAlt, 
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
  FaRegStar,
  FaUserCircle,
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaMinus,
  FaInfoCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ProfileMenu from "./profileMenu";
import { toast } from 'react-hot-toast';

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
    upcomingEvents: 0
  });

  // Load user data and favorites
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data.user);
        
        // Simulate fetching user stats
        setStats({
          eventsAttended: Math.floor(Math.random() * 20),
          hoursVolunteered: Math.floor(Math.random() * 100),
          upcomingEvents: Math.floor(Math.random() * 5)
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const savedFavorites = localStorage.getItem("volunteerFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    fetchUserData();
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("volunteerFavorites", JSON.stringify(favorites));
  }, [favorites]);

  // Fetch events
  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/events/approved");
        const data = await response.json();
        
        const categorizedEvents = data.map(event => ({
          ...event,
          category: categorizeEvent(event.name),
          isFavorite: favorites.includes(event._id),
          volunteersRegistered: Math.floor(Math.random() * 50) // Simulate random volunteers
        }));
        
        setEvents(categorizedEvents);
      } catch (error) {
        console.error("Error fetching approved events:", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedEvents();
  }, [favorites]);

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
        : "Added to favorites"
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
        toast.success("Link copied to clipboard!");
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
      return (b.volunteersNeeded || 0) - (a.volunteersNeeded || 0);
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
      case 'environment': return 'green';
      case 'education': return 'blue';
      case 'health': return 'red';
      default: return 'purple';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 flex flex-col">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gray-800/80 backdrop-blur-md text-white p-5 flex justify-between items-center shadow-lg rounded-b-xl border-b border-teal-400/20"
      >
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <span className="text-3xl">🌟</span>
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
            Make a Difference
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={() => setShowNotification(!showNotification)}
          >
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
              3
            </span>
          </motion.button>
          
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-full"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-2xl" />
              )}
              <span className="hidden md:inline">{user?.name || "User"}</span>
              {showProfileMenu ? <FaChevronUp /> : <FaChevronDown />}
            </motion.button>
            
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <div className="py-1">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-600"
                      onClick={() => navigate("/profile")}
                    >
                      Your Profile
                    </button>
                  
                    <div className="border-t border-gray-600"></div>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/20 text-red-400"
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
      </motion.nav>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-4 w-80 bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowNotification(false)}
              >
                &times;
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {[
                { id: 1, title: "New event near you", message: "Tree planting this weekend", time: "2h ago", read: false },
                { id: 2, title: "Registration confirmed", message: "You're signed up for the beach cleanup", time: "1d ago", read: true },
                { id: 3, title: "Volunteer spotlight", message: "You've been featured for your contributions", time: "3d ago", read: true }
              ].map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer ${!notification.read ? 'bg-blue-900/20' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-teal-400">{notification.title}</h4>
                      <p className="text-sm text-gray-300">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 text-center text-sm text-blue-400 hover:text-blue-300 cursor-pointer border-t border-gray-700">
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
        className="flex-grow flex flex-col items-center p-4 md:p-8 space-y-8"
      >
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl w-full"
        >
          <div className="relative inline-block">
            <motion.h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-600 drop-shadow-lg mb-4">
              Welcome, {user?.name || "Volunteer"}!
            </motion.h2>
            <motion.span 
              className="absolute -top-6 -right-8 text-4xl" 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🤝
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-300 mt-4 leading-relaxed max-w-3xl mx-auto"
          >
            Your passion fuels change. Discover meaningful opportunities to contribute 
            your time and skills to causes that need you most.
          </motion.p>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            {[
              { 
                title: "Events Attended", 
                value: stats.eventsAttended, 
                icon: <FaCalendarAlt className="text-2xl text-blue-400" />,
                color: "bg-blue-500/20"
              },
              { 
                title: "Hours Volunteered", 
                value: stats.hoursVolunteered, 
                icon: <FaRegClock className="text-2xl text-green-400" />,
                color: "bg-green-500/20"
              },
              { 
                title: "Upcoming Events", 
                value: stats.upcomingEvents, 
                icon: <FaUsers className="text-2xl text-purple-400" />,
                color: "bg-purple-500/20"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`${stat.color} p-6 rounded-xl shadow-md backdrop-blur-sm border border-gray-700/50`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-800/50">
                    {stat.icon}
                  </div>
                </div>
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
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg"
              >
                <FaFilter /> {showFilters ? "Hide" : "Show"} Filters
              </Button>
              
              <select
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="volunteers">Sort by Volunteers Needed</option>
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
              className="w-full mt-4 bg-gray-700/50 p-6 rounded-xl backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Category</label>
                  <select
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Date</label>
                  <input
                    type="date"
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                    className="w-full bg-gray-600 hover:bg-gray-500 px-4 py-3 rounded-lg"
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-teal-600 hover:bg-teal-500 px-4 py-3 rounded-lg"
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
              { name: 'All Events', value: 'all', emoji: '🌟', color: 'bg-purple-500' },
              { name: 'Environment', value: 'environment', emoji: '🌱', color: 'bg-green-500' },
              { name: 'Education', value: 'education', emoji: '📚', color: 'bg-blue-500' },
              { name: 'Health', value: 'health', emoji: '❤️', color: 'bg-red-500' }
            ].map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center ${
                  activeFilter === filter.value 
                    ? `${filter.color} text-white shadow-lg` 
                    : 'bg-gray-700 hover:bg-gray-600'
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 w-full bg-gray-800/50 rounded-xl"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-300">No matching events found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            <Button 
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
                setSelectedDate("");
              }}
              className="mt-4 bg-teal-600 hover:bg-teal-500"
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
                  className={`bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden border ${
                    event.category === 'environment' ? 'border-green-400/20 hover:border-green-400/40' :
                    event.category === 'education' ? 'border-blue-400/20 hover:border-blue-400/40' :
                    event.category === 'health' ? 'border-red-400/20 hover:border-red-400/40' :
                    'border-gray-700/50 hover:border-purple-400/30'
                  } transition-all duration-300`}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event._id);
                        }}
                        className="absolute top-4 right-4 z-20 bg-gray-900/80 p-2 rounded-full hover:bg-yellow-500/80 transition-colors"
                      >
                        <FaStar className={event.isFavorite ? "text-yellow-400" : "text-gray-400"} />
                      </button>
                      
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        <div className="bg-gray-900/80 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          {getCategoryIcon(event.category)}
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </div>
                        <div className="bg-gray-900/80 px-3 py-1 rounded-full text-sm font-medium text-teal-400 flex items-center">
                          <FaUsers className="mr-1" /> {event.volunteersNeeded || "0"} needed
                        </div>
                      </div>
                    </div>

                    {/* Event Content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="p-6 flex-grow flex flex-col"
                    >
                      {/* Event Name */}
                      <motion.h3
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`text-2xl font-bold mb-3 cursor-pointer transition-colors ${
                          event.category === 'environment' ? 'text-green-400 hover:text-green-300' :
                          event.category === 'education' ? 'text-blue-400 hover:text-blue-300' :
                          event.category === 'health' ? 'text-red-400 hover:text-red-300' :
                          'text-purple-400 hover:text-purple-300'
                        }`}
                        onClick={() => handleEventClick(event._id)}
                      >
                        {event.name}
                      </motion.h3>

                      {/* Event Description */}
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {event.description || "No description provided."}
                      </p>

                      {/* Expandable Details */}
                      <AnimatePresence>
                        {expandedEvent === event._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 text-gray-300 mt-2 text-sm">
                              <div className="flex items-start">
                                <FaMapMarkerAlt className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                                <div>
                                  <p className="font-medium">Location:</p>
                                  <p>{event.location || "Location not specified"}</p>
                                </div>
                              </div>
                              <div className="flex items-start">
                                <FaCalendarAlt className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                                <div>
                                  <p className="font-medium">Date & Time:</p>
                                  <p>
                                    {new Date(event.date).toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      month: 'long', 
                                      day: 'numeric',
                                      year: 'numeric'
                                    }) || "TBD"} at {event.time || "Time not specified"}
                                  </p>
                                </div>
                              </div>
                              {event.requirements?.length > 0 && (
                                <div className="flex items-start">
                                  <FaInfoCircle className="mr-3 mt-1 flex-shrink-0 text-gray-400" />
                                  <div>
                                    <p className="font-medium">Requirements:</p>
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

                      {/* Event Details */}
                      <div className="space-y-3 text-gray-300 mt-auto text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaUsers className="mr-2 text-gray-400" />
                            <span>{event.volunteersRegistered} registered</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleEventExpand(event._id);
                            }}
                            className="text-blue-400 hover:text-blue-300 flex items-center"
                          >
                            {expandedEvent === event._id ? (
                              <>
                                <span className="mr-1">Less</span>
                                <FaChevronUp />
                              </>
                            ) : (
                              <>
                                <span className="mr-1">More</span>
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
                        className="flex justify-between mt-6 pt-4 border-t border-gray-700/50"
                      >
                        <Button 
                          className="text-blue-400 hover:text-blue-300 flex items-center group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(event);
                          }}
                        >
                          <FaShareAlt className="mr-2 group-hover:animate-bounce" /> 
                          <span className="text-sm">Share</span>
                        </Button>

                        <Button 
                          className={`px-4 py-2 rounded-full text-white hover:shadow-lg transition-all ${
                            event.category === 'environment' ? 'bg-green-500 hover:bg-green-600 hover:shadow-green-500/20' :
                            event.category === 'education' ? 'bg-blue-500 hover:bg-blue-600 hover:shadow-blue-500/20' :
                            event.category === 'health' ? 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/20' :
                            'bg-purple-500 hover:bg-purple-600 hover:shadow-purple-500/20'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            registerForEvent(event._id);
                          }}
                        >
                          Register Now
                        </Button>
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
        className="fixed bottom-8 right-8 bg-gradient-to-r from-teal-500 to-green-500 text-white p-4 rounded-full shadow-xl z-40 flex items-center justify-center"
        onClick={() => navigate("/create-event")}
      >
        <FaPlus className="text-xl" />
      </motion.button>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-md text-gray-300 text-center py-8 mt-auto border-t border-gray-700/50"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-bold text-teal-400 mb-2">VolunteersHub</h4>
              <p className="text-sm max-w-md">Connecting compassionate individuals with meaningful opportunities to create positive change in communities worldwide.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-left">
              <div>
                <h5 className="font-semibold text-white mb-3">Explore</h5>
                <ul className="space-y-2">
                  {['Events', 'Organizations', 'Success Stories', 'Blog'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm hover:text-teal-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-white mb-3">About</h5>
                <ul className="space-y-2">
                  {['Our Mission', 'Team', 'Partners', 'Careers'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm hover:text-teal-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold text-white mb-3">Support</h5>
                <ul className="space-y-2">
                  {['FAQ', 'Contact Us', 'Privacy Policy', 'Terms'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm hover:text-teal-400 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} VolunteersHub. All rights reserved.
            </p>
            
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-xs hover:text-teal-400 transition-colors"
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default VolunteerDashboard;