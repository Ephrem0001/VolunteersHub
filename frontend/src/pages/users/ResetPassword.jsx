import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import myImage from './ty.jpg';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is valid when component mounts
    const checkToken = async () => {
      try {
        const response = await fetch(`https://volunteershub-6.onrender.com/api/auth/validate-reset-token/${token}`);
        const data = await response.json();
        
        if (!response.ok) {
          setTokenValid(false);
          setError(data.message || "Invalid or expired token");
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setTokenValid(false);
        setError("Error validating token. Please try again.");
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`https://volunteershub-6.onrender.com/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-white">Validating token...</div>
      </div>
    );
  }

  if (!tokenValid) {
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

        <motion.div
          className="relative z-10 bg-gray-800/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-red-500/30 mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col items-center text-center">
            <FontAwesomeIcon 
              icon={faTimesCircle} 
              className="text-red-500 text-5xl mb-4" 
            />
            <h2 className="text-2xl font-bold text-red-400 mb-2">Invalid Token</h2>
            <p className="text-gray-300 mb-6">{error || "The password reset link is invalid or has expired."}</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-green-400 hover:text-green-300 font-medium"
            >
              Request a new reset link
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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

      {/* Glassmorphic Reset Password Box */}
      <motion.div
        className="relative z-10 bg-gray-800/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-purple-500/30 mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Header section */}
        <div className="flex flex-col items-center mb-8">
          <motion.h2
            className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {success ? "Password Reset!" : "Reset Password"}
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {success 
              ? "Your password has been successfully updated. Redirecting to login..." 
              : "Enter your new password below"}
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

        {/* Success message */}
        {success && (
          <motion.div
            className="mb-6 p-4 bg-green-900/50 border-l-4 border-green-400 text-green-100 rounded-lg flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
            <p>Password updated successfully!</p>
          </motion.div>
        )}

        {!success ? (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Password Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1 ml-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full p-3 pl-10 bg-gray-700/50 text-white border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1 ml-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  className="w-full p-3 pl-10 bg-gray-700/50 text-white border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all group"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
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
                    Updating...
                  </>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
