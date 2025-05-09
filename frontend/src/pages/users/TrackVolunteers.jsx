import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";

const TrackVolunteers = () => {
  const [volunteerRows, setVolunteerRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    console.log("Current user:", user);
    const userId = user?.id || user?._id;
    if (!userId) {
      setLoading(false);
      return;
    }
  
    const controller = new AbortController();
    let didCancel = false;
  
    const fetchVolunteersForEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/appliers?eventCreatorId=${userId}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch volunteers");
        const data = await res.json();
        const appliers = data.appliers || [];
        console.log("Fetched appliers:", appliers);
    
        const rows = await Promise.all(appliers.map(async (applier) => {
          let eventName = "N/A";
          let eventType = "N/A";
          let eventDate = "N/A";
          let eventLocation = "N/A";
          if (applier.eventId) {
            try {
              const eventRes = await fetch(`http://localhost:5000/api/events/${applier.eventId}`);
              if (eventRes.ok) {
                const eventData = await eventRes.json();
                eventName = eventData.name || eventData.title || "N/A";
                eventType = eventData.category || eventData.type || "N/A";
                eventDate = eventData.date ? new Date(eventData.date).toLocaleDateString() : "N/A";
                eventLocation = eventData.location || "N/A";
              }
            } catch (err) {
              // Use defaults if fetch fails
            }
          }
          return {
            volunteerName: applier.name,
            volunteerSex: applier.sex,
            volunteerAge: applier.age,
            volunteerSkills: applier.skills,
            eventName,
            eventType,
            eventDate,
            eventLocation,
          };
        }));
        const validRows = rows.filter(Boolean);
        if (!didCancel) setVolunteerRows(validRows);
      } catch (err) {
        if (!didCancel) {
          console.error("Error fetching volunteers:", err);
          setVolunteerRows([]);
        }
      } finally {
        if (!didCancel) setLoading(false);
      }
    };
  
    fetchVolunteersForEvents();
  
    return () => {
      didCancel = true;
      controller.abort();
    };
  }, [user]);

  const filteredRows = volunteerRows
  .filter(row => row && (
    (row.volunteerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.eventName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.eventType || "").toLowerCase().includes(searchTerm.toLowerCase())
  ));

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
            </div>
          ) : filteredRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sex</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name OfEvent</th>
                    {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th> */}
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">{row.volunteerName}</td>
                      <td className="px-4 py-2">{row.volunteerSex}</td>
                      <td className="px-4 py-2">{row.volunteerAge}</td>
                      <td className="px-4 py-2">{row.volunteerSkills}</td>
                      <td className="px-4 py-2">{row.eventName}</td>
                      {/* <td className="px-4 py-2">{row.eventType}</td> */}
                      <td className="px-4 py-2">{row.eventDate}</td>
                      <td className="px-4 py-2">{row.eventLocation}</td>
                    </tr>
                  ))}
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