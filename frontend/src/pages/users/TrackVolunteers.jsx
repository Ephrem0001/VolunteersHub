import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag
} from "react-icons/fa";

const TrackVolunteers = () => {
  const [volunteerRows, setVolunteerRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchVolunteersForEvents = async () => {
            setLoading(true);
      try { 
        // 1. Fetch all events created by the current user (organizer)
        const eventsRes = await fetch(`http://localhost:5000/api/events?creatorId=${user.id}`);
        const eventsData = await eventsRes.json();
        const events = eventsData.data || [];

        // 2. For each event, fetch volunteer details
        let rows = [];
        for (const event of events) {
          if (event.volunteers && event.volunteers.length > 0) {
            for (const volunteerId of event.volunteers) {
              // Fetch volunteer details
              const volunteerRes = await fetch(`http://localhost:5000/api/users/${volunteerId}`);
              if (!volunteerRes.ok) continue;
              const volunteerData = await volunteerRes.json();
              const volunteer = volunteerData.user || volunteerData;

              rows.push({
                volunteerName: volunteer.name,
                volunteerEmail: volunteer.email,
                volunteerPhone: volunteer.phone,
                eventName: event.name,
                eventType: event.category || event.type || "N/A",
                eventLocation: event.location,
                eventDate: new Date(event.date).toLocaleDateString(),
              });
            }
          }
        }
        setVolunteerRows(rows);
      } catch (err) {
        setVolunteerRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteersForEvents();
  }, [user]);

  // Filter by search term
  const filteredRows = volunteerRows.filter(row =>
    row.volunteerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.eventType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Registered Volunteers</h1>
          <p className="text-gray-600">
            All volunteers who registered for your events, including event type.
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search volunteers or events..."
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
          ) : filteredRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredRows.map((row, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          <FaUser className="text-purple-600" /> {row.volunteerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.volunteerEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.volunteerPhone || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.eventName}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          <FaTag className="text-gray-400" /> {row.eventType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" /> {row.eventDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" /> {row.eventLocation}
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
                {searchTerm
                  ? "Try adjusting your search."
                  : "Volunteers will appear here once they register for your events."}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrackVolunteers;