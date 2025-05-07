import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaThumbsUp,
  FaComment,
  FaUserPlus,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaInfoCircle,
  FaClock,
  FaUsers,
  FaArrowLeft,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaStar,
  FaRegStar,
  FaMagic,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [likes, setLikes] = useState([]); // Array of user IDs who liked
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [volunteerInfo, setVolunteerInfo] = useState({
    name: "",
    sex: "",
    skills: "",
    age: ""
  });
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const CITY_COORDINATES = {
    "addis ababa": { lat: 9.0054, lng: 38.7636 },
    "gondar": { lat: 12.6064, lng: 37.4572 },
    "bahirdar": { lat: 11.6000, lng: 37.3833 },
    "mekele": { lat: 13.4966, lng: 39.4767 },
    "hawassa": { lat: 7.0500, lng: 38.4667 },
    "diredawa": { lat: 9.5892, lng: 41.8607 },
    "adama": { lat: 8.5414, lng: 39.2683 },
    "jimma": { lat: 7.6667, lng: 36.8333 },
    "arbaminch": { lat: 6.0333, lng: 37.5500 },
    "harar": { lat: 9.3132, lng: 42.1182 }
  };

  // Default event details content
  const defaultEventContent = {
    about: "This community event brings people together to make a positive impact in our local area. Volunteers will work alongside organizers to accomplish meaningful tasks that benefit the community. Whether you're an experienced volunteer or this is your first time, your participation will make a real difference. The event is open to all ages and skill levels, with tasks available for everyone.",
    requirements: [
      "Positive attitude and willingness to help",
      "Comfortable clothing suitable for the activity",
      "Ability to work in a team environment",
      "Basic understanding of the local language"
    ],
    itemsToBring: [
      "Water bottle to stay hydrated",
      "Sun protection (hat, sunscreen)",
      "Work gloves if you have them",
      "Any necessary personal medications"
    ]
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // TEMP: Set a dummy user for testing
          setCurrentUser({ _id: "123", name: "Test User" });
          return;
        }
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
      if (!response.ok) throw new Error("Failed to fetch event details");
      const data = await response.json();
      setEvent(data);
      setVolunteerCount(Array.isArray(data.volunteers) ? data.volunteers.length : 0);
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]); // Add `registered` or similar state that changes after registration  // ...existing code...
const handleLike = async () => {
  if (!currentUser || !currentUser._id) {
    showNotification("You must be logged in to like events.", "error");
    return;
  }
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/events/${eventId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: currentUser._id,
        like: !isLiked
      })
    });

    if (!response.ok) throw new Error("Failed to update like");

    const data = await response.json();
    setLikes(data.likes);
    setIsLiked(!isLiked);

    showNotification(
      !isLiked 
        ? "You liked this event!" 
        : "You unliked this event",
      !isLiked ? "success" : "info"
    );
  } catch (error) {
    console.error("Error updating like:", error);
    showNotification("Failed to update like", "error");
  }
};
// ...existing code...

  const handleBookmark = () => {
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);
    localStorage.setItem(`event_${eventId}_bookmarked`, newBookmarkStatus);
    
    showNotification(
      newBookmarkStatus ? "Event bookmarked!" : "Bookmark removed",
      newBookmarkStatus ? "success" : "info"
    );
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    localStorage.setItem(`event_${eventId}_rating`, newRating.toString());
    showNotification(`You rated this event ${newRating} star${newRating > 1 ? 's' : ''}!`, "success");
  };

  const handleCommentChange = (e) => setComments(e.target.value);

  // ...existing code...
  const handleCommentSubmit = async () => {
    console.log("Submitting comment", { comments, currentUser });
    if (!comments.trim()) return;
  
    if (!currentUser || !currentUser.name || !currentUser._id) {
      showNotification("You must be logged in to comment.", "error");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: comments,
          author: currentUser.name,
          authorId: currentUser._id,
          avatar: currentUser.profilePicture || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to post comment:", errorText);
        throw new Error("Failed to post comment");
      }
  
      const data = await response.json();
      setCommentList(data.comments);
      setComments("");
      showNotification("Comment added!", "success");
    } catch (error) {
      console.error("Error posting comment:", error);
      showNotification("Failed to post comment", "error");
    }
  };

  const handleJoin = () => setShowForm(true);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setVolunteerInfo(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

// ...existing code...
const handleFormSubmit = async (e) => {
  e.preventDefault();

  let errors = {};
  if (!volunteerInfo.name.trim()) errors.name = "Name is required";
  if (!volunteerInfo.sex) errors.sex = "Gender is required";
  if (!volunteerInfo.skills.trim()) errors.skills = "Skills are required";
  if (!volunteerInfo.age || isNaN(volunteerInfo.age)) errors.age = "Valid age is required";
  else if (volunteerInfo.age < 16) errors.age = "Must be at least 16 years old";

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

 
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(volunteerInfo) // <-- Only send volunteerInfo
    });

    if (!response.ok) throw new Error("Registration failed");

    await fetchEventDetails();
    setVolunteerInfo({ name: "", sex: "", skills: "", age: "" });
    setShowForm(false);
    setSubscribed(true);
    localStorage.setItem(`event_${eventId}_subscribed`, "true");
    showNotification("Thank you for volunteering!", "success");
  } catch (error) {
    console.error("Registration error:", error);
    showNotification("Registration failed", "error");
  } finally {
    setLoading(false);
  }
};
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this volunteering opportunity: ${event.description}`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      setShareOpen(true);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareOpen(false);
    showNotification("Link copied to clipboard!", "success");
  };

  const showNotification = (message, type = "success") => {
    const toastOptions = {
      icon: type === "success" ? "🎉" : type === "error" ? "❌" : "ℹ️",
      style: {
        background: type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6",
        color: "#fff",
      },
    };

    toast(message, toastOptions);
  };

  if (loading && !event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Back Button */}
      <motion.button 
        onClick={() => navigate(-1)}
        whileHover={{ x: -5 }}
        className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Events
      </motion.button>

      {/* Event Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Event Image */}
        {event.image && (
          <div className="relative h-80 w-full overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBookmark}
                className="p-2 bg-white/90 rounded-full shadow-md backdrop-blur-sm"
              >
                {isBookmarked ? (
                  <FaBookmark className="text-yellow-500" />
                ) : (
                  <FaRegBookmark className="text-gray-700 hover:text-yellow-500" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareEvent}
                className="p-2 bg-white/90 rounded-full shadow-md backdrop-blur-sm"
              >
                <FaShare className="text-blue-500 hover:text-blue-700" />
              </motion.button>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600">{event.description}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= (hoverRating || rating) ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-gray-300 hover:text-yellow-300" />
                    )}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {rating > 0 ? `Your rating: ${rating}` : "Rate this event"}
              </span>
            </div>
          </div>
          
          {/* Event Meta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <FaCalendarAlt className="mr-2 text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <FaMapMarkerAlt className="mr-2 text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <FaUsers className="mr-2 text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Volunteers</p>
                <p className="font-medium">{volunteerCount} joined</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <FaHeart className="mr-2 text-blue-500 text-lg" />
              <div>
                <p className="text-xs text-gray-500">Likes</p>
                <p className="font-medium">{likes.length}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Share this event</h3>
              <div className="flex justify-center space-x-4 mb-6">
                <motion.button 
                  whileHover={{ y: -2 }}
                  className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                >
                  <FaFacebook className="text-xl" />
                </motion.button>
                <motion.button 
                  whileHover={{ y: -2 }}
                  className="p-3 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200"
                >
                  <FaTwitter className="text-xl" />
                </motion.button>
                <motion.button 
                  whileHover={{ y: -2 }}
                  className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800"
                >
                  <FaLinkedin className="text-xl" />
                </motion.button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyLink}
                  className="px-4 py-2 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700"
                >
                  Copy
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "details" ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Event Details
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setActiveTab("volunteers")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "volunteers" ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Volunteers ({volunteerCount})
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setActiveTab("comments")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "comments" ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Comments ({commentList.length})
          </motion.button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === "details" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <FaInfoCircle className="mr-2 text-teal-500" />
                About This Event
              </h3>
              <p className="text-gray-600 mb-4">
                {event.longDescription || defaultEventContent.about}
              </p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                    {event.requirements?.length > 0 ? (
                      event.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))
                    ) : (
                      defaultEventContent.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">What to Bring:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 pl-4">
                    {event.itemsToBring?.length > 0 ? (
                      event.itemsToBring.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      defaultEventContent.itemsToBring.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-wrap gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLike}
                    className={`flex items-center px-4 py-2 rounded-lg ${isLiked ? 'bg-pink-500 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {isLiked ? (
                      <FaHeart className="mr-2 text-white" />
                    ) : (
                      <FaRegHeart className="mr-2" />
                    )}
                    <span>{likes.length} Likes</span>
                  </motion.button>

                  {!subscribed ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleJoin}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg"
                    >
                      <FaUserPlus className="mr-2" />
                      Join Event
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg cursor-default"
                    >
                      <FaCheckCircle className="mr-2" />
                      You're Registered!
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Event created by: {event.organizer || "Community"}</span>
                  <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white p-4 rounded-xl shadow-sm h-64 border border-gray-100">
                {event.location && CITY_COORDINATES[event.location.toLowerCase().trim()] ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      CITY_COORDINATES[event.location.toLowerCase().trim()].lng - 0.05
                    }%2C${
                      CITY_COORDINATES[event.location.toLowerCase().trim()].lat - 0.05
                    }%2C${
                      CITY_COORDINATES[event.location.toLowerCase().trim()].lng + 0.05
                    }%2C${
                      CITY_COORDINATES[event.location.toLowerCase().trim()].lat + 0.05
                    }&layer=mapnik&marker=${
                      CITY_COORDINATES[event.location.toLowerCase().trim()].lat
                    },${
                      CITY_COORDINATES[event.location.toLowerCase().trim()].lng
                    }`}
                    title={`Map of ${event.location}`}
                  ></iframe>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <FaMapMarkerAlt className="text-3xl mx-auto mb-2 text-teal-400" />
                      <p>Map of {event.location}</p>
                      <p className="text-sm">(Map not available for this location)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "volunteers" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaUsers className="mr-2 text-teal-500" />
              Volunteers ({volunteerCount})
            </h3>
            
            {volunteerCount > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: Math.min(volunteerCount, 8) }).map((_, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <img 
                      src={`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`} 
                      alt="Volunteer" 
                      className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-teal-100"
                    />
                    <p className="font-medium text-gray-700">Volunteer {i+1}</p>
                    <p className="text-xs text-gray-500">Joined recently</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaUsers className="text-4xl mx-auto mb-4 text-gray-300" />
                <p>No volunteers yet. Be the first to join!</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "comments" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaComment className="mr-2 text-teal-500" />
                  Comments ({commentList.length})
                </h3>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <textarea
                  value={comments}
                  onChange={handleCommentChange}
                  placeholder="Share your thoughts about this event..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-3"
                  rows="3"
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {comments.length}/500 characters
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCommentSubmit}
                    disabled={!comments.trim()}
                    className={`px-4 py-2 rounded-lg ${comments.trim() ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Post Comment
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                {commentList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaComment className="text-4xl mx-auto mb-4 text-gray-300" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  commentList.map(comment => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-start">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-teal-100"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">{comment.author}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-gray-600 mt-2">{comment.text}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <button className="flex items-center mr-4 hover:text-pink-500">
                              <FaThumbsUp className="mr-1" /> Like
                            </button>
                            <button className="flex items-center hover:text-teal-500">
                              <FaComment className="mr-1" /> Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Volunteer Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Volunteer Registration</h3>
                
                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name</label>
                      <input
                        name="name"
                        value={volunteerInfo.name}
                        onChange={handleFormChange}
                        placeholder="Your name"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-200'}`}
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Gender</label>
                      <select
                        name="sex"
                        value={volunteerInfo.sex}
                        onChange={handleFormChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.sex ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-200'}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                      {formErrors.sex && <p className="text-red-500 text-sm mt-1">{formErrors.sex}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Age</label>
                      <input
                        name="age"
                        type="number"
                        min="16"
                        max="100"
                        value={volunteerInfo.age}
                        onChange={handleFormChange}
                        placeholder="Your age"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.age ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-200'}`}
                      />
                      {formErrors.age && <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Skills & Experience</label>
                      <textarea
                        name="skills"
                        value={volunteerInfo.skills}
                        onChange={handleFormChange}
                        placeholder="Describe your skills and any relevant experience"
                        rows="3"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.skills ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-teal-200'}`}
                      ></textarea>
                      {formErrors.skills && <p className="text-red-500 text-sm mt-1">{formErrors.skills}</p>}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetailsPage;