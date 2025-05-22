import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaMapMarkerAlt, FaUpload, FaLightbulb, FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import myImage from "./ty.jpg"; // Background image from login file

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const eventNameSuggestions = [
    "Charity Run for Clean Water",
    "Food Drive for the Homeless",
    "Education for All Fundraiser",
    "Tree Planting Campaign",
    "Medical Supplies Donation Drive",
    "Women Empowerment Workshop",
    "Youth Leadership Summit",
    "Disaster Relief Fundraiser",
    "Animal Shelter Support Event",
    "Community Health Awareness Day",
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.name || !formData.description || !formData.date || !formData.location) {
      alert("Please fill out all required fields.");
      setIsSubmitting(false);
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create an event.");
      navigate("/login");
      setIsSubmitting(false);
      return;
    }
  
    const eventData = new FormData();
    eventData.append("name", formData.name);
    eventData.append("description", formData.description);
    eventData.append("date", formData.date);
    eventData.append("location", formData.location);
    if (formData.image) {
      eventData.append("image", formData.image);
    }
  
    try {
      const response = await fetch("https://volunteershub-6.onrender.com/api/events/create", {
        method: "POST",
        body: eventData,
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Event creation failed");
  
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/ngo/ngodashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center p-4 overflow-hidden"
      style={{ backgroundImage: `url(${myImage})` }}
    >
      {/* Animated floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: Math.random() * 10 + 5 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 100],
            x: [0, (Math.random() - 0.5) * 50],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/20 to-black/70"></div>

      <motion.div
        className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/80 to-gray-800/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full filter blur-xl opacity-20"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500 rounded-full filter blur-xl opacity-20"></div>
        
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-300 mb-2">
          Create Your Event
        </h2>
        <p className="text-center text-gray-300 mb-6">Bring people together for a good cause</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Event Name */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative flex items-center bg-gray-800 rounded-lg">
                <FaLightbulb className="absolute left-3 text-teal-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Event Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  list="eventNames"
                  className="w-full p-3 bg-transparent text-white border-0 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none placeholder-gray-400 pl-10"
                />
              </div>
              <datalist id="eventNames">
                {eventNameSuggestions.map((name, index) => (
                  <option key={index} value={name} />
                ))}
              </datalist>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Date */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <div className="relative flex items-center bg-gray-800 rounded-lg">
                  <FaCalendarAlt className="absolute left-3 text-blue-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-transparent text-white border-0 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-400 pl-10"
                  />
                </div>
              </div>

              {/* Event Location */}
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

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Event Image (Optional)</label>
              {formData.image ? (
                <div className="relative group">
                  <div className="relative flex items-center justify-center p-4 bg-gray-800 rounded-lg border border-dashed border-gray-600">
                    <div className="flex flex-col items-center">
                      <FaImage className="text-2xl text-teal-400 mb-2" />
                      <span className="text-sm text-gray-300">{formData.image.name}</span>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="mt-2 flex items-center text-xs text-red-400 hover:text-red-300"
                      >
                        <IoMdClose className="mr-1" /> Remove
                      </button>
                    </div>
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
                Creating...
              </span>
            ) : (
              "Create Event"
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-green-600 to-teal-700 p-8 rounded-xl shadow-2xl max-w-sm text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-100 mb-4">Your event has been created and is pending approval.</p>
              <motion.div
                className="h-1 bg-white/30 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CreateEvent;
