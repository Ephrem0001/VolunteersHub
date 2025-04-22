import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaFacebook,
  FaTwitter,
  FaGoogle,
  FaHandsHelping,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";
import { motion } from "framer-motion";
import l from "./l.jpeg"; // Background image

const RegisterVolunteer = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://eventmannagemnt-11.onrender.com/api/auth/register/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setIsEmailSent(true);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration failed:", error);
      alert("An error occurred while registering.");
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={l} 
          alt="background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-gray-900/90"></div>
      </div>

      {/* Floating decorative elements */}
      {[...Array(8)].map((_, i) => (
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
            opacity: [0.05, 0.15, 0.05],
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
        className="relative z-10 bg-gray-800/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-purple-500/30"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
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

        {/* Header section */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            className="p-4 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full shadow-lg mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FaHandsHelping className="text-white text-3xl" />
          </motion.div>
          <motion.h2
            className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Volunteer Registration
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Join our community of change-makers
          </motion.p>
        </div>

        {isEmailSent ? (
          <motion.div
            className="text-center p-6"
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
                Please check your inbox to complete your registration.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Didn't receive the email?{" "}
                <button className="text-purple-400 hover:text-purple-300 underline">
                  Resend verification
                </button>
              </p>
            </div>
            <motion.button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home <FaArrowRight />
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { name: "name", icon: FaUserAlt, label: "Full Name", type: "text" },
              { name: "email", icon: FaEnvelope, label: "Email Address", type: "email" },
              { name: "password", icon: FaLock, label: "Password", type: showPassword ? "text" : "password" },
            ].map(({ name, icon: Icon, label, type }, index) => (
              <motion.div
                key={name}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
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
                  {name === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-400"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/terms")}
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Terms
                  </button>
                </label>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <motion.button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all font-medium ${
                  loading && "opacity-70 cursor-not-allowed"
                }`}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Join Our Community <FaArrowRight />
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.div
              className="relative my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {[
                { icon: FaFacebook, color: "bg-blue-600 hover:bg-blue-700", label: "Facebook" },
                { icon: FaTwitter, color: "bg-sky-500 hover:bg-sky-600", label: "Twitter" },
                { icon: FaGoogle, color: "bg-red-600 hover:bg-red-700", label: "Google" },
              ].map(({ icon: Icon, color, label }, index) => (
                <motion.button
                  key={label}
                  type="button"
                  className={`flex items-center justify-center py-2.5 rounded-lg ${color} text-white transition-colors`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-xl" />
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
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
          </motion.form>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RegisterVolunteer;