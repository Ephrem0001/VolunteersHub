import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt, 
  FaUser, 
  FaMapMarkerAlt,
  FaArrowLeft,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaSort
} from "react-icons/fa";

const TrackVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    eventId: "",
    sortBy: "recent"
  });
  const [eventsList, setEventsList] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch volunteers with filters
        const queryParams = new URLSearchParams({
          creatorId: user.id,
          ...(filters.eventId && { eventId: filters.eventId }),
          ...(filters.sortBy && { sortBy: filters.sortBy }),
          ...(searchTerm && { search: searchTerm })
        }).toString();

        const [volunteersRes, eventsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/appliers?${queryParams}`),
          fetch(`http://localhost:5000/api/events?creatorId=${user.id}`)
        ]);

        if (!volunteersRes.ok || !eventsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [volunteersData, eventsData] = await Promise.all([
          volunteersRes.json(),
          eventsRes.json()
        ]);

        setVolunteers(volunteersData.data || []);
        setEventsList(eventsData.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, filters, searchTerm]);

  const handleDelete = async (volunteerId) => {
    if (!window.confirm("Are you sure you want to remove this volunteer?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/appliers/${volunteerId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete volunteer");

      setVolunteers(volunteers.filter(v => v._id !== volunteerId));
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
    }
  };

  const handleContact = (volunteer) => {
    // In a real app, this would open a contact modal or email client
    alert(`Contacting ${volunteer.name}\nEmail: ${volunteer.email || 'Not provided'}\nPhone: ${volunteer.phone || 'Not provided'}`);
  };

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-6 text-lg font-semibold">
        Please log in to view this page.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back
        </motion.button>

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Volunteer Management</h1>
          <p className="text-gray-600">
            View and manage volunteers for your events
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search volunteers..."
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Event Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                value={filters.eventId}
                onChange={(e) => setFilters({...filters, eventId: e.target.value})}
              >
                <option value="">All Events</option>
                {eventsList.map(event => (
                  <option key={event._id} value={event._id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="recent">Most Recent</option>
                <option value="name">By Name (A-Z)</option>
                <option value="age">By Age</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-600">Loading volunteer data...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p className="font-medium">Error loading volunteers:</p>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : volunteers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {volunteers.map((volunteer) => (
                      <motion.tr
                        key={volunteer._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <FaUser className="text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                              <div className="text-sm text-gray-500">{volunteer.age} years • {volunteer.sex}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{volunteer.eventName}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaCalendarAlt className="mr-1 text-gray-400" />
                            {volunteer.eventDate}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaMapMarkerAlt className="mr-1 text-gray-400" />
                            {volunteer.eventLocation}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{volunteer.skills}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Applied: {new Date(volunteer.applicationDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleContact(volunteer)}
                              className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition-colors"
                              title="Contact"
                            >
                              <FaEnvelope />
                            </button>
                            <button
                              onClick={() => handleDelete(volunteer._id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaUser className="inline-block text-4xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No volunteers found</h3>
              <p className="text-gray-500">
                {searchTerm || filters.eventId 
                  ? "Try adjusting your search or filters" 
                  : "Volunteers will appear here once they apply to your events"}
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-500">Total Volunteers</h3>
              <p className="text-3xl font-bold text-purple-600">{volunteers.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-500">Unique Events</h3>
              <p className="text-3xl font-bold text-purple-600">
                {new Set(volunteers.map(v => v.eventId)).size}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-500">Average Age</h3>
              <p className="text-3xl font-bold text-purple-600">
                {volunteers.length > 0 
                  ? Math.round(volunteers.reduce((sum, v) => sum + (v.age || 0), 0) / volunteers.length)
                  : 0}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TrackVolunteers;