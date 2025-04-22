import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaGlobe,
  FaHandsHelping,
  FaFileSignature,
  FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import backgroundImage from "./ji.jpg";

const RegisterNGO = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organization: "",
    website: "",
    mission: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      setRegistrationMessage("Please agree to the Terms and Conditions.");
      return;
    }
  
    setIsSubmitting(true);
    setRegistrationMessage("");
  
    try {
      console.log("Submitting form data:", formData);
      
      const response = await fetch("https://eventmannagemnt-11.onrender.com/api/auth/register/ngo", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
  
      const data = await response.json();
      setIsEmailSent(true);
      setRegistrationMessage(data.message || "Registration successful! Please check your email.");
  
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific error cases
      if (error.message.includes("Failed to fetch")) {
        setRegistrationMessage("Network error. Please check your connection and try again.");
      } else {
        setRegistrationMessage(error.message || "An unexpected error occurred during registration.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gray-900 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating decorative elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-500 opacity-10"
          style={{
            width: Math.random() * 100 + 50 + 'px',
            height: Math.random() * 100 + 50 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 100],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-3xl backdrop-blur-xl bg-opacity-90 border border-purple-500/30 relative overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none">
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-purple-500/20"
            animate={{
              boxShadow: [
                "0 0 10px rgba(168, 85, 247, 0.3)",
                "0 0 20px rgba(168, 85, 247, 0.4)",
                "0 0 10px rgba(168, 85, 247, 0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Header with icon */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="p-4 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full shadow-lg mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <FaHandsHelping className="text-white text-3xl" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            NGO Registration
          </h2>
          <p className="text-gray-400 mt-2 text-center">
            Join our community of change-makers
          </p>
        </div>

        {registrationMessage && (
          <motion.div
            className={`mb-6 p-4 rounded-xl ${
              isEmailSent
                ? "bg-blue-900/50 border-l-4 border-blue-400 text-blue-100"
                : "bg-green-900/50 border-l-4 border-green-400 text-green-100"
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="flex items-center gap-2">
              <FaCheckCircle className="flex-shrink-0" />
              {registrationMessage}
            </p>
          </motion.div>
        )}

        {!isEmailSent ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "name", icon: FaUserAlt, label: "Your Name" },
              { name: "email", icon: FaEnvelope, label: "Email Address" },
              { name: "password", icon: FaLock, label: "Password", type: "password" },
              { name: "organization", icon: FaBuilding, label: "Organization Name" },
              { name: "website", icon: FaGlobe, label: "Website URL" },
            ].map(({ name, icon: Icon, label, type = "text" }, index) => (
              <motion.div
                className="relative"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1 ml-1">
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 pl-10 bg-gray-700/50 text-white border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all group"
                  />
                </div>
              </motion.div>
            ))}

            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="mission" className="block text-sm font-medium text-gray-400 mb-1 ml-1">
                Mission Statement
              </label>
              <textarea
                id="mission"
                name="mission"
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Tell us about your organization's mission and goals..."
              />
            </motion.div>

            <motion.div
              className="md:col-span-2 flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
              </div>
              <label htmlFor="terms" className="ml-3 text-sm text-gray-300">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => navigate("/ngo/termsandcondition")}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => navigate("/ngo/privacypolicy")}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Privacy Policy
                </button>
              </label>
            </motion.div>

            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <motion.button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all font-medium"
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaFileSignature />
                    Register Now
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              className="md:col-span-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-purple-400 hover:text-purple-300 font-medium"
                >
                  Sign in here
                </button>
              </p>
            </motion.div>
          </form>
        ) : (
          <motion.div
            className="text-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-6">
              <motion.div
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaCheckCircle className="text-green-400 text-4xl" />
              </motion.div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-300 mb-6">
                We've sent a verification email to <span className="font-medium text-white">{formData.email}</span>.
                Please check your inbox and follow the instructions to complete your registration.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Didn't receive the email?{" "}
                <button className="text-purple-400 hover:text-purple-300 underline">
                  Resend verification
                </button>
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RegisterNGO;