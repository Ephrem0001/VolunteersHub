import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaUser,
  FaArrowLeft,
  FaFilter,
  FaDownload,
  FaPrint,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaInfoCircle,
  FaStar,
  FaRegStar,
  FaEllipsisV,
  FaCalendarDay,
  FaCalendarWeek
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import { toast } from 'react-hot-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TrackVolunteers = () => {
  const [volunteerRows, setVolunteerRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    eventType: "",
    sex: "",
    minAge: "",
    maxAge: "",
    location: "",
    dateRange: [null, null],
    upcomingEvents: false,
    pastEvents: false
  });
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch volunteers data (same as before)
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
          `https://volunteershub-6.onrender.com/api/appliers?eventCreatorId=${userId}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch volunteers");
        const data = await res.json();
        const appliers = data.appliers || [];
        console.log("Fetched appliers:", appliers);
    
        const rows = await Promise.all(appliers.map(async (applier) => {
          let eventName = "";
          let eventType = "";
          let eventDate = "";
          let eventLocation = "";
          let eventImage = "";
          let eventDateTime = null;
          if (applier.eventId) {
            try {
              const eventRes = await fetch(`https://volunteershub-6.onrender.com/api/events/my/${applier.eventId}`);
              if (eventRes.ok) {
                const eventData = await eventRes.json();
                eventName = eventData.name || eventData.title || "";
                eventType = eventData.category || eventData.type || "";
                eventDateTime = eventData.date ? new Date(eventData.date) : null;
                eventDate = eventDateTime ? eventDateTime.toLocaleDateString() : "";
                eventLocation = eventData.location || "";
                eventImage = eventData.image || "";
              }
            } catch (err) {
              console.error("Error fetching event details:", err);
            }
          }
          return {
            id: applier._id,
            volunteerName: applier.name,
            volunteerSex: applier.sex,
            volunteerAge: applier.age,
            volunteerSkills: applier.skills,
            volunteerEmail: applier.email,
            volunteerPhone: applier.phone,
            eventName,
            eventType,
            eventDate,
            eventDateTime,
            eventLocation,
            eventImage,
            rating: Math.floor(Math.random() * 5) + 1
          };
        }));
        const validRows = rows.filter(Boolean);
        if (!didCancel) setVolunteerRows(validRows);
      } catch (err) {
        if (!didCancel) {
          console.error("Error fetching volunteers:", err);
          setVolunteerRows([]);
          showNotification("Failed to load volunteers", "error");
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

  const showNotification = (message, type = "success") => {
    toast(message, {
      icon: type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️",
      style: {
        background: type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6",
        color: "#fff",
      },
    });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters(prev => ({ 
      ...prev, 
      dateRange: [start, end],
      upcomingEvents: false,
      pastEvents: false
    }));
  };

  const toggleUpcomingEvents = () => {
    setFilters(prev => ({ 
      ...prev, 
      upcomingEvents: !prev.upcomingEvents,
      pastEvents: false,
      dateRange: [null, null]
    }));
  };

  const togglePastEvents = () => {
    setFilters(prev => ({ 
      ...prev, 
      pastEvents: !prev.pastEvents,
      upcomingEvents: false,
      dateRange: [null, null]
    }));
  };

  const resetFilters = () => {
    setFilters({
      eventType: "",
      sex: "",
      minAge: "",
      maxAge: "",
      location: "",
      dateRange: [null, null],
      upcomingEvents: false,
      pastEvents: false
    });
  };

  const filteredRows = volunteerRows.filter(row => {
    // Search term filter
    const matchesSearch = 
      (row.volunteerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.eventName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.eventType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (row.volunteerSkills || "").toLowerCase().includes(searchTerm.toLowerCase());

    // Additional filters
    const matchesEventType = !filters.eventType || 
      (row.eventType || "").toLowerCase() === filters.eventType.toLowerCase();
    const matchesSex = !filters.sex || 
      (row.volunteerSex || "").toLowerCase() === filters.sex.toLowerCase();
    const matchesMinAge = !filters.minAge || 
      (row.volunteerAge || 0) >= parseInt(filters.minAge);
    const matchesMaxAge = !filters.maxAge || 
      (row.volunteerAge || 0) <= parseInt(filters.maxAge);
    const matchesLocation = !filters.location ||
      (row.eventLocation || "").toLowerCase().includes(filters.location.toLowerCase());

    // Date filters
    const now = new Date();
    let matchesDate = true;
    
    if (filters.upcomingEvents) {
      matchesDate = row.eventDateTime && row.eventDateTime > now;
    } else if (filters.pastEvents) {
      matchesDate = row.eventDateTime && row.eventDateTime <= now;
    } else if (filters.dateRange[0] || filters.dateRange[1]) {
      const [startDate, endDate] = filters.dateRange;
      if (row.eventDateTime) {
        if (startDate && !endDate) {
          matchesDate = row.eventDateTime >= startDate;
        } else if (!startDate && endDate) {
          matchesDate = row.eventDateTime <= endDate;
        } else if (startDate && endDate) {
          matchesDate = row.eventDateTime >= startDate && row.eventDateTime <= endDate;
        }
      } else {
        matchesDate = false;
      }
    }

    return (
      matchesSearch && 
      matchesEventType && 
      matchesSex && 
      matchesMinAge && 
      matchesMaxAge && 
      matchesLocation && 
      matchesDate
    );
  });

  const exportData = filteredRows.map(row => ({
    "Volunteer Name": row.volunteerName,
    "Gender": row.volunteerSex,
    "Age": row.volunteerAge,
    "Skills": row.volunteerSkills,
    "Email": row.volunteerEmail,
    "Phone": row.volunteerPhone,
    "Event Name": row.eventName,
    "Event Type": row.eventType,
    "Event Date": row.eventDate,
    "Event Location": row.eventLocation
  }));

  const printTable = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Volunteers Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .header { display: flex; justify-content: space-between; }
            .date { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Volunteers Report</h1>
            <div class="date">${new Date().toLocaleDateString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Volunteer Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Skills</th>
                <th>Event Name</th>
                <th>Event Date</th>
                <th>Event Location</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRows.map(row => `
                <tr>
                  <td>${row.volunteerName || '-'}</td>
                  <td>${row.volunteerSex || '-'}</td>
                  <td>${row.volunteerAge || '-'}</td>
                  <td>${row.volunteerSkills || '-'}</td>
                  <td>${row.eventName || '-'}</td>
                  <td>${row.eventDate || '-'}</td>
                  <td>${row.eventLocation || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleRowClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  const sendEmail = (email) => {
    if (!email) {
      showNotification("No email address available for this volunteer", "error");
      return;
    }
    window.location.href = `mailto:${email}`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center text-red-500 text-lg font-semibold p-6 bg-white rounded-xl shadow-md">
          Please log in to view this page.
        </div>
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
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white p-3 rounded-lg shadow-sm"
          >
            <FaArrowLeft /> Back
          </motion.button>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => printTable()}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <FaPrint /> Print
            </motion.button>
            
            <CSVLink 
              data={exportData} 
              filename={"volunteers-report.csv"}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <FaDownload /> Export
            </CSVLink>
          </div>
        </div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Volunteer Management</h1>
              <p className="text-gray-600">
                View and manage all volunteers registered for your events
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full">
              <FaUser className="text-lg" />
              <span className="font-medium">
                {filteredRows.length} {filteredRows.length === 1 ? 'Volunteer' : 'Volunteers'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search volunteers, events, or skills..."
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg ${filterOpen ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}
            >
              <FaFilter /> Filters
            </motion.button>
          </div>

          <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Personal Filters */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    name="eventType"
                    value={filters.eventType}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Types</option>
                    <option value="environmental">Environmental</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="community">Community</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="sex"
                    value={filters.sex}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                    <input
                      type="number"
                      name="minAge"
                      min="16"
                      max="100"
                      value={filters.minAge}
                      onChange={handleFilterChange}
                      placeholder="Min age"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                    <input
                      type="number"
                      name="maxAge"
                      min="16"
                      max="100"
                      value={filters.maxAge}
                      onChange={handleFilterChange}
                      placeholder="Max age"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City or venue"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quick Date Filters</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleUpcomingEvents}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md ${filters.upcomingEvents ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <FaCalendarDay className="text-sm" />
                      <span>Upcoming</span>
                    </button>
                    <button
                      type="button"
                      onClick={togglePastEvents}
                      className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md ${filters.pastEvents ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <FaCalendarWeek className="text-sm" />
                      <span>Past</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <DatePicker
                    selectsRange={true}
                    startDate={filters.dateRange[0]}
                    endDate={filters.dateRange[1]}
                    onChange={handleDateChange}
                    isClearable={true}
                    placeholderText="Select date range"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    disabled={filters.upcomingEvents || filters.pastEvents}
                  />
                </div>
                
                {filters.dateRange[0] || filters.dateRange[1] ? (
                  <div className="text-sm text-gray-600">
                    {filters.dateRange[0] && filters.dateRange[1] ? (
                      <span>
                        {filters.dateRange[0].toLocaleDateString()} to {filters.dateRange[1].toLocaleDateString()}
                      </span>
                    ) : filters.dateRange[0] ? (
                      <span>After {filters.dateRange[0].toLocaleDateString()}</span>
                    ) : (
                      <span>Before {filters.dateRange[1].toLocaleDateString()}</span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <button
                onClick={resetFilters}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Reset All Filters
              </button>
              <div className="text-sm text-gray-500">
                Showing {filteredRows.length} of {volunteerRows.length} volunteers
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-500">Loading volunteers...</p>
            </div>
          ) : filteredRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRows.map((row, idx) => (
                    <motion.tr 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="cursor-pointer"
                      onClick={() => handleRowClick(row)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <FaUser className="text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{row.volunteerName}</div>
                            <div className="text-sm text-gray-500">{row.volunteerSex}, {row.volunteerAge} yrs</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{row.volunteerSkills}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{row.eventName}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {row.eventDate}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-gray-400" />
                          {row.eventLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            star <= row.rating ? (
                              <FaStar key={star} className="text-yellow-400" />
                            ) : (
                              <FaRegStar key={star} className="text-gray-300" />
                            )
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-purple-600 hover:text-purple-900">
                          <FaEllipsisV />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FaUser className="inline-block text-5xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {searchTerm || Object.values(filters).some(Boolean) 
                  ? "No matching volunteers found" 
                  : "No volunteers registered yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || Object.values(filters).some(Boolean)
                  ? "Try adjusting your search or filters."
                  : "Volunteers will appear here once they register for your events."}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Volunteer Detail Modal */}
      <AnimatePresence>
        {selectedVolunteer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedVolunteer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedVolunteer.volunteerName}</h2>
                    <p className="text-gray-600">{selectedVolunteer.volunteerSex}, {selectedVolunteer.volunteerAge} years old</p>
                  </div>
                  <button 
                    onClick={() => setSelectedVolunteer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaInfoCircle className="mr-2 text-purple-500" />
                      Volunteer Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Skills</p>
                        <p className="text-gray-800">{selectedVolunteer.volunteerSkills}</p>
                      </div>
                      <div>
                
                        {selectedVolunteer.volunteerPhone && (
                          <div className="flex items-center gap-2 mt-1">
                            <FaPhone className="text-gray-400" />
                            <span className="text-gray-800">{selectedVolunteer.volunteerPhone}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            star <= selectedVolunteer.rating ? (
                              <FaStar key={star} className="text-yellow-400" />
                            ) : (
                              <FaRegStar key={star} className="text-gray-300" />
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-500" />
                      Event Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Event Name</p>
                        <p className="text-gray-800 font-medium">{selectedVolunteer.eventName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Event Type</p>
                        <p className="text-gray-800">{selectedVolunteer.eventType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-gray-800 flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {selectedVolunteer.eventDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-800 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-gray-400" />
                          {selectedVolunteer.eventLocation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedVolunteer.eventImage && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Image</h3>
                    <img 
                      src={selectedVolunteer.eventImage} 
                      alt={selectedVolunteer.eventName} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedVolunteer(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                  {/* <button
                    onClick={() => sendEmail(selectedVolunteer.volunteerEmail)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    disabled={!selectedVolunteer.volunteerEmail}
                  >
                    <FaEnvelope /> Contact Volunteer
                  </button> */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TrackVolunteers;