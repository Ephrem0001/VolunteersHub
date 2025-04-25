import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaTrash, 
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaFilter,
  FaRegClock
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date-asc");
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserEvents = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            navigate("/login");
            return;
          }
  
          const response = await fetch("https://eventmannagemnt-11.onrender.com/api/events/my-events", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const result = await response.json();
          
          // Handle both array and object responses
          const eventsData = Array.isArray(result) ? result : (result.data || []);
          
          setEvents(eventsData);
          setError(null);
        } catch (error) {
          console.error("Error fetching user events:", error);
          setError(error.message || "Failed to fetch events");
          setEvents([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserEvents();
    }, [navigate]);

    // Apply filters and sorting
    useEffect(() => {
      let result = [...events];
      
      // Apply search filter
      if (searchTerm) {
        result = result.filter(event => 
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply status filter
      if (statusFilter !== "all") {
        result = result.filter(event => event.status === statusFilter);
      }
      
      // Apply sorting
      switch (sortBy) {
        case "date-asc":
          result.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case "date-desc":
          result.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
      
      setFilteredEvents(result);
    }, [events, searchTerm, statusFilter, sortBy]);

    const handleEdit = (eventId) => {
      navigate(`/ngo/edit-event/${eventId}`);
    };
     

    const handleDelete = async (eventId) => {
      if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
        return;
      }
    
      setDeletingId(eventId);
      setError(null);
      setSuccessMessage("");
    
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token missing. Please login again.");
        }
    
        const response = await fetch(`https://eventmannagemnt-11.onrender.com/api/events/${eventId}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          // Handle specific error messages from backend
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(data.error || 'Failed to delete event');
        }
    
        // Optimistic UI update
        setEvents(prev => prev.filter(e => e._id !== eventId));
        setFilteredEvents(prev => prev.filter(e => e._id !== eventId));
        
        setSuccessMessage(data.message || "Event deleted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
    
      } catch (error) {
        console.error("Delete error:", error);
        
        // User-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.message.includes('401')) {
          errorMessage = "Session expired. Please login again.";
        }
    
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      } finally {
        setDeletingId(null);
      }
    };

    const getStatusBadge = (status) => {
      const statusConfig = {
        approved: {
          icon: <FaCheckCircle className="mr-1" />,
          bg: "bg-green-500/20",
          text: "text-green-400",
          label: "Approved"
        },
        pending: {
          icon: <FaSpinner className="mr-1 animate-spin" />,
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          label: "Pending"
        },
        rejected: {
          icon: <FaTimesCircle className="mr-1" />,
          bg: "bg-red-500/20",
          text: "text-red-400",
          label: "Rejected"
        },
        expired: {
          icon: <FaRegClock className="mr-1" />,
          bg: "bg-purple-500/20",
          text: "text-purple-400",
          label: "Expired"
        }
      };

      const config = statusConfig[status] || {
        icon: null,
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        label: "Unknown"
      };

      return (
        <span className={`${config.bg} ${config.text} px-2 py-1 rounded-full text-xs flex items-center`}>
          {config.icon}
          {config.label}
        </span>
      );
    };

    const getEventCardClass = (status) => {
      switch (status) {
        case "approved":
          return "hover:border-green-400/30";
        case "pending":
          return "hover:border-yellow-400/30";
        case "rejected":
          return "hover:border-red-400/30";
        case "expired":
          return "hover:border-purple-400/30";
        default:
          return "hover:border-teal-400/30";
      }
    };

    const getTimeRemaining = (eventDate) => {
      const now = new Date();
      const eventTime = new Date(eventDate);
      const diff = eventTime - now;
      
      if (diff < 0) return "Event passed";
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) return `${days} day${days !== 1 ? 's' : ''} left`;
      if (hours > 0) return `${hours.toFixed(0)} hour${hours !== 1 ? 's' : ''} left`;
      return "Less than an hour left";
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <FaSpinner className="text-4xl text-teal-400 mb-4" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              className="text-gray-300"
            >
              Loading your events...
            </motion.p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md p-6 bg-gray-800/70 rounded-xl backdrop-blur-sm border border-gray-700"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
              <FaExclamationTriangle className="text-2xl text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Error Loading Events</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-500 sm:text-5xl lg:text-6xl"
            >
              Manage Your Events
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-3 max-w-2xl mx-auto text-xl text-gray-300 sm:mt-4"
            >
              Organize, edit, and track your events
            </motion.p>
          </div>

          {/* Status Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-green-600/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center"
              >
                <FaCheckCircle className="mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-red-600/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center"
              >
                <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center">
                  <FaFilter className="text-gray-400 mr-2" />
                  <select
                    className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-teal-500 focus:border-teal-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <select
                  className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-teal-500 focus:border-teal-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-asc">Date (Ascending)</option>
                  <option value="date-desc">Date (Descending)</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
                
                <button
                  onClick={() => navigate("/ngo/create-event")}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
                  data-tooltip-id="create-tooltip"
                >
                  <FaPlus className="mr-2" />
                  Create Event
                </button>
                <Tooltip id="create-tooltip" place="top" effect="solid">
                  Create a new event
                </Tooltip>
              </div>
            </div>
          </motion.div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-gray-800/50 rounded-xl border border-dashed border-gray-600"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500/10 rounded-full mb-6">
                <FaCalendarAlt className="text-3xl text-teal-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No events found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : "You haven't created any events yet"}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  navigate("/ngo/create-event");
                }}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-green-600 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center mx-auto"
              >
                <FaPlus className="mr-2" />
                {searchTerm || statusFilter !== "all" ? "Reset Filters" : "Create Your First Event"}
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 ${getEventCardClass(event.status)}`}
                    whileHover={{ y: -5 }}
                  >
                    <div className="h-full flex flex-col">
                      {/* Event Image */}
                      <div className="relative h-48 overflow-hidden group">
                        <motion.img
                          src={event.image?.startsWith('http') ? event.image : `https://eventmannagemnt-11.onrender.com${event.image}`}
                          alt={event.name}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-white font-medium">
                            {getTimeRemaining(event.date)}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3">
                          {getStatusBadge(event.status)}
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-teal-400 mb-2 line-clamp-1">
                          {event.name}
                        </h3>
                        
                        <p className="text-gray-300 mb-4 line-clamp-2 flex-grow">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-400 flex-shrink-0" />
                            <span>
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-yellow-400 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="px-5 pb-5 flex justify-between">
                      <button
  onClick={() => handleEdit(event._id)}
  disabled={event.status === "approved"}
  className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
    event.status === "approved"
      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
      : "bg-blue-600/30 hover:bg-blue-600/40 text-blue-400"
  }`}
  data-tooltip-id={`edit-tooltip-${event._id}`}
>
  <FaEdit className="mr-2" /> Edit
</button>

                        <Tooltip id={`edit-tooltip-${event._id}`}>
                          {event.status === "approved" 
                            ? "Approved events cannot be edited" 
                            : "Edit this event"}
                        </Tooltip>
                        
                        <button
                          onClick={() => handleDelete(event._id)}
                          disabled={deletingId === event._id}
                          className="px-4 py-2 bg-red-600/30 hover:bg-red-600/40 text-red-400 rounded-lg flex items-center transition-colors"
                          data-tooltip-id={`delete-tooltip-${event._id}`}
                        >
                          {deletingId === event._id ? (
                            <>
                              <FaSpinner className="mr-2 animate-spin" /> Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash className="mr-2" /> Delete
                            </>
                          )}
                        </button>
                        <Tooltip id={`delete-tooltip-${event._id}`}>
                          Delete this event
                        </Tooltip>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
};

export default ManageEvents;