import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faLock, 
  faHandsHelping,
  faUserShield,
  faUserTie,
  faArrowRight,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import myImage from './ty.jpg';
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { email, password });
    
    setIsLoading(true);
    setError("");
  
    try {
      const response = await fetch("https://eventmannagemnt-11.onrender.com/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        }),
      });
  
      // Handle non-JSON responses
      if (response.status === 404) {
        throw new Error("Login endpoint not found (404)");
      }
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login(data.user); // Update auth context
  
      // Redirect based on role
      setTimeout(() => {
        switch(data.user.role.toLowerCase()) {
          case "volunteer":
            navigate("/volunteerdashboard");
            break;
          case "ngo":
            navigate("/ngo/ngodashboard");
            break;
          case "admin":
            navigate("/admindashboard");
            break;
          default:
            navigate("/");
        }
      }, 500);
  
    } catch (error) {
      console.error("Login error:", error);
      
      // Specific error messages
      if (error.message.includes("Failed to fetch")) {
        setError("Network error. Please check your connection.");
      } else if (error.message.includes("404")) {
        setError("Login service unavailable. Please try again later.");
      } else {
        setError(error.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      className="relative flex justify-center items-center min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={myImage} 
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

      {/* Glassmorphic Login Box */}
      <motion.div
        className="relative z-10 bg-gray-800/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-purple-500/30 mx-4"
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
            className="p-4 bg-gradient-to-br from-green-500 to-teal-400 rounded-full shadow-lg mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FontAwesomeIcon icon={faHandsHelping} className="text-white text-3xl" />
          </motion.div>
          <motion.h2
            className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sign in to continue your journey
          </motion.p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-400 text-red-100 rounded-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{error}</p>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleLogin}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Email Input */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-10 bg-gray-700/50 text-white border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group"
                placeholder="your.email@example.com"
              />
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400 group-hover:text-green-400 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 pl-10 pr-10 bg-gray-700/50 text-white border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </motion.div>

          {/* Forgot Password Link */}
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:text-green-300 underline"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Login Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <motion.button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all font-medium ${
                isLoading && "opacity-70 cursor-not-allowed"
              }`}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Register Link */}
        <motion.div
          className="text-center pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Create one now
            </button>
          </p>
        </motion.div>
      </motion.div>

      {/* Registration Choice Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-700"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Join Our Community
            </motion.h2>
            <div className="space-y-4">
              <motion.button
                onClick={() => {
                  setShowModal(false);
                  navigate("/register-ngo");
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FontAwesomeIcon icon={faUserShield} />
                Register as NGO
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowModal(false);
                  navigate("/register-volunteer");
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FontAwesomeIcon icon={faUserTie} />
                Register as Volunteer
              </motion.button>
            </div>
            <motion.button
              onClick={() => setShowModal(false)}
              className="mt-6 text-gray-400 hover:text-gray-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Login;