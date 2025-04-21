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
  FaRegStar
} from "react-icons/fa";
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [likes, setLikes] = useState(0);
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

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        if (!response.ok) throw new Error("Failed to fetch event details");

        const data = await response.json();
        setEvent(data);
        setVolunteerCount(data.volunteers || 0);

        // Initialize likes from localStorage or event data
        const storedLikes = localStorage.getItem(`event_${eventId}_likes`);
        setLikes(storedLikes ? parseInt(storedLikes) : data.likes || 0);

        // Check if user has liked this event
        const likedStatus = localStorage.getItem(`event_${eventId}_liked`);
        setIsLiked(likedStatus === "true");

        // Check if bookmarked
        const bookmarkStatus = localStorage.getItem(`event_${eventId}_bookmarked`);
        setIsBookmarked(bookmarkStatus === "true");

        // Load comments from localStorage
        const storedComments = localStorage.getItem(`event_${eventId}_comments`);
        setCommentList(storedComments ? JSON.parse(storedComments) : []);

        // Load rating
        const storedRating = localStorage.getItem(`event_${eventId}_rating`);
        setRating(storedRating ? parseInt(storedRating) : 0);

        // Check if subscribed
        const subStatus = localStorage.getItem(`event_${eventId}_subscribed`);
        setSubscribed(subStatus === "true");
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    const newLikes = newLikeStatus ? likes + 1 : likes - 1;

    // Update state
    setIsLiked(newLikeStatus);
    setLikes(newLikes);

    // Save to localStorage
    localStorage.setItem(`event_${eventId}_liked`, newLikeStatus);
    localStorage.setItem(`event_${eventId}_likes`, newLikes.toString());

    showNotification(newLikeStatus ? "You liked this event!" : "You unliked this event");
  };

  const handleBookmark = () => {
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);
    localStorage.setItem(`event_${eventId}_bookmarked`, newBookmarkStatus);
    
    showNotification(newBookmarkStatus ? "Event bookmarked!" : "Bookmark removed");
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    localStorage.setItem(`event_${eventId}_rating`, newRating.toString());
    showNotification(`You rated this event ${newRating} star${newRating > 1 ? 's' : ''}!`);
  };

  const handleCommentChange = (e) => setComments(e.target.value);

  const handleCommentSubmit = () => {
    if (!comments.trim()) return;

    const newComment = {
      id: Date.now(),
      text: comments,
      author: "You",
      createdAt: new Date().toISOString(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };

    const updatedComments = [...commentList, newComment];
    setCommentList(updatedComments);
    setComments("");

    localStorage.setItem(`event_${eventId}_comments`, JSON.stringify(updatedComments));
    showNotification("Comment added!");
  };

  const handleJoin = () => setShowForm(true);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setVolunteerInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

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

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setVolunteerInfo({ name: "", sex: "", skills: "", age: "" });
      setShowForm(false);
      setSubscribed(true);
      setVolunteerCount(prev => prev + 1);
      localStorage.setItem(`event_${eventId}_subscribed`, "true");
      setLoading(false);
      showNotification("Thank you for volunteering!");
    }, 1500);
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
    showNotification("Link copied to clipboard!");
  };

  const showNotification = (message) => {
    document.dispatchEvent(new CustomEvent("show-notification", {
      detail: {
        message,
        type: "success"
      }
    }));
  };

  if (loading && !event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <motion.button 
        onClick={() => navigate(-1)}
        whileHover={{ x: -5 }}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Events
      </motion.button>

      {/* Event Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Event Image */}
        {event.image && (
          <div className="relative h-64 w-full overflow-hidden">
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
                className="p-2 bg-white/80 rounded-full shadow"
              >
                {isBookmarked ? (
                  <FaBookmark className="text-yellow-500" />
                ) : (
                  <FaRegBookmark className="text-gray-700" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareEvent}
                className="p-2 bg-white/80 rounded-full shadow"
              >
                <FaShare className="text-blue-500" />
              </motion.button>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.description}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRating(star)}
                    className="text-xl focus:outline-none"
                  >
                    {star <= (hoverRating || rating) ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-gray-300" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-4">
            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg">
              <FaCalendarAlt className="mr-2 text-blue-500" />
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
            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg">
              <FaClock className="mr-2 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700 bg-blue-50 p-3 rounded-lg">
              <FaUsers className="mr-2 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Volunteers</p>
                <p className="font-medium">{volunteerCount} joined</p>
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
              <h3 className="text-xl font-semibold mb-4">Share this event</h3>
              <div className="flex space-x-4 mb-6">
                <button className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <FaFacebook className="text-xl" />
                </button>
                <button className="p-3 bg-sky-100 text-sky-600 rounded-full">
                  <FaTwitter className="text-xl" />
                </button>
                <button className="p-3 bg-red-100 text-red-600 rounded-full">
                  <FaShare className="text-xl" />
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none"
                />
                <button
                  onClick={copyLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "details" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Event Details
          </button>
          <button
            onClick={() => setActiveTab("volunteers")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "volunteers" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Volunteers ({volunteerCount})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "comments" ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Comments ({commentList.length})
          </button>
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
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                About This Event
              </h3>
              <p className="text-gray-600 mb-4">{event.longDescription || "No detailed description available."}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {event.requirements?.length > 0 ? (
                      event.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">No special requirements</li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">What to Bring:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {event.itemsToBring?.length > 0 ? (
                      event.itemsToBring.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">Nothing specific</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-wrap gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLike}
                    className={`flex items-center px-4 py-2 rounded-lg ${isLiked ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    <FaThumbsUp className="mr-2" />
                    <span>{likes} Likes</span>
                  </motion.button>

                  {!subscribed ? (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleJoin}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg"
                    >
                      <FaUserPlus className="mr-2" />
                      Join Event
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg cursor-default"
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

              {/* Map Placeholder */}
              <div className="bg-white p-4 rounded-xl shadow-sm h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FaMapMarkerAlt className="text-3xl mx-auto mb-2 text-blue-400" />
                  <p>Map of {event.location}</p>
                  <p className="text-sm">(Interactive map would be displayed here)</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "volunteers" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaUsers className="mr-2 text-blue-500" />
              Volunteers ({volunteerCount})
            </h3>
            
            {volunteerCount > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: Math.min(volunteerCount, 8) }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`} 
                      alt="Volunteer" 
                      className="w-16 h-16 rounded-full mb-2 object-cover"
                    />
                    <p className="font-medium text-gray-700">Volunteer {i+1}</p>
                    <p className="text-xs text-gray-500">Joined recently</p>
                  </div>
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
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaComment className="mr-2 text-blue-500" />
                  Comments ({commentList.length})
                </h3>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <textarea
                  value={comments}
                  onChange={handleCommentChange}
                  placeholder="Share your thoughts about this event..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  rows="3"
                />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {comments.length}/500 characters
                  </div>
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!comments.trim()}
                    className={`px-4 py-2 rounded-lg ${comments.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Post Comment
                  </button>
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
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-start">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-10 h-10 rounded-full mr-3 object-cover"
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
                            <button className="flex items-center mr-4 hover:text-blue-500">
                              <FaThumbsUp className="mr-1" /> Like
                            </button>
                            <button className="flex items-center hover:text-blue-500">
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
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-1">Gender</label>
                      <select
                        name="sex"
                        value={volunteerInfo.sex}
                        onChange={handleFormChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.sex ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
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
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.age ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
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
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.skills ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                      ></textarea>
                      {formErrors.skills && <p className="text-red-500 text-sm mt-1">{formErrors.skills}</p>}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
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