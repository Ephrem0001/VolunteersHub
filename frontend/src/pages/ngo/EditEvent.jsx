import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaUpload, FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    image: null,
    previewUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ethiopianCities = [
    "Addis Ababa",
    "Bahir Dar",
    "Gondar",
    "Mekele",
    "Hawassa",
    "Dire Dawa",
    "Adama",
    "Jimma",
    "Arba Minch",
    "Harar",
  ];

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://volunteershub-6.onrender.com/api/edit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const data = await response.json();
      if (!data.event) {
        throw new Error('Event data is not available');
      }

      setEvent(data.event);
      setFormData({
        name: data.event.name,
        description: data.event.description,
        startDate: data.event.startDate ? formatDateForInput(data.event.startDate) : '',
        endDate: data.event.endDate ? formatDateForInput(data.event.endDate) : '',
        location: data.event.location,
        image: data.event.image,
        previewUrl: data.event.image ? `https://volunteershub-6.onrender.com/uploads/${data.event.image}` : ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch (e) {
      console.error("Error formatting date:", e);
      return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ 
        ...formData, 
        image: file,
        previewUrl: URL.createObjectURL(file)
      });
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null, previewUrl: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate || !formData.location) {
      alert("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert("End date must be after start date.");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to edit an event.");
      navigate("/login");
      setIsSubmitting(false);
      return;
    }

    const eventData = new FormData();
    eventData.append("name", formData.name);
    eventData.append("description", formData.description);
    eventData.append("startDate", formData.startDate);
    eventData.append("endDate", formData.endDate);
    eventData.append("location", formData.location);
    if (formData.image && typeof formData.image !== 'string') {
      eventData.append("image", formData.image);
    }

    try {
      const response = await fetch(`https://volunteershub-6.onrender.com/api/edit/${id}`, {
        method: "PUT",
        body: eventData,
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      navigate('/ngo/manage-events');
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center p-4 overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/20 to-black/70"></div>

      <motion.div
        className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/80 to-gray-800/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 mb-2">
          Edit Event
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Event Name */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Event Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800 text-white border-0 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* Event Description */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative">
                <textarea
                  name="description"
                  placeholder="Describe your event in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800 text-white border-0 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none placeholder-gray-400"
                  rows="4"
                ></textarea>
              </div>
            </div>

            {/* Date and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Event Start Date */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">Start Date</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex items-center bg-gray-800 rounded-lg">
                    <FaCalendarAlt className="absolute left-3 text-blue-400" />
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full p-3 bg-transparent text-white border-0 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400 pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Event End Date */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">End Date</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex items-center bg-gray-800 rounded-lg">
                    <FaCalendarAlt className="absolute left-3 text-blue-400" />
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      min={formData.startDate || new Date().toISOString().slice(0, 16)}
                      className="w-full p-3 bg-transparent text-white border-0 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400 pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Event Location */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">Location</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex items-center bg-gray-800 rounded-lg">
                    <FaMapMarkerAlt className="absolute left-3 text-yellow-400" />
                    <input
                      type="text"
                      name="location"
                      placeholder="Event Location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      list="cities"
                      className="w-full p-3 bg-transparent text-white border-0 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none placeholder-gray-400 pl-10"
                    />
                  </div>
                  <datalist id="cities">
                    {ethiopianCities.map((city, index) => (
                      <option key={index} value={city} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Event Image (Optional)</label>
              {formData.previewUrl ? (
                <div className="relative group">
                  <div className="relative flex items-center justify-center p-4 bg-gray-800 rounded-lg border border-dashed border-gray-600">
                    <img 
                      src={formData.previewUrl} 
                      alt="Preview" 
                      className="max-h-48 rounded-md object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                    >
                      <IoMdClose className="text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <label className="relative flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg border border-dashed border-gray-600 cursor-pointer hover:bg-gray-700/50 transition-all">
                    <FaUpload className="text-2xl text-pink-400 mb-2" />
                    <span className="text-sm text-gray-300">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (max 5MB)</span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white ${isSubmitting 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'}`}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              "Update Event"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditEvent;
