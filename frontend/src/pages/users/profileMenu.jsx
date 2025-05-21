// components/ProfileMenu.js
import { useState } from "react";
import { FaUser, FaSignOutAlt, FaTimes, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfileMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
   localStorage.removeItem("token");
   toast.success("Logged out successfully");
   setTimeout(() => {
     navigate("/login", { replace: true });
   }, 1000);
 };
  const handleProfileClick = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full transition-all duration-300"
      >
        <span className="font-medium">{user?.name || "User"}</span>
        {isOpen ? (
          <FaTimes className="text-gray-300" />
        ) : (
          <FaBars className="text-gray-300" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700"
          >
            <div className="py-1">
              <button
                onClick={handleProfileClick}
                className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left"
              >
                <FaUser className="mr-2" />
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 w-full text-left"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;