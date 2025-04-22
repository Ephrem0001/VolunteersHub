import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes, faHandsHelping, faUserAlt,faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <nav className="fixed w-full top-0 z-50 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-md py-3 px-4 sm:px-6 border-b border-blue-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center mr-4"
        >
          <Link to="/" className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
              <FontAwesomeIcon icon={faHandsHelping} className="text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              VolunteerHub
            </span>
          </Link>
        </motion.div>

        {/* Left Side: Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center bg-white rounded-lg overflow-hidden border border-blue-200 shadow-sm"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 md:w-64 px-4 py-2 bg-transparent text-black placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-l-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            <span className="hidden md:inline">Search</span>
          </button>
        </motion.form>

        {/* Centered Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 justify-center space-x-6">
          <motion.ul
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
            className="flex space-x-6"
          >
            <motion.li variants={itemVariants}>
              <Link
                to="/"
                className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-3 py-1 rounded-lg transition duration-300 text-sm md:text-base font-medium flex items-center"
              >
                <span className="mr-1"></span> Home
              </Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a
                href="#about"
                className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-3 py-1 rounded-lg transition duration-300 text-sm md:text-base font-medium flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="mr-1"></span> About
              </a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a
                href="#features"
                className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-3 py-1 rounded-lg transition duration-300 text-sm md:text-base font-medium flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#features").scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="mr-1"></span> Features
              </a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a
                href="#contact"
                className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-3 py-1 rounded-lg transition duration-300 text-sm md:text-base font-medium flex items-center"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="mr-1"></span> Contact
              </a>
            </motion.li>
          </motion.ul>
        </div>

        {/* Right Side: Buttons (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.button
            variants={itemVariants}
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition duration-300 shadow-md text-sm md:text-base font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faUserAlt} className="mr-2" />
            Register
          </motion.button>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 hover:scale-105 transition duration-300 shadow-md text-sm md:text-base font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Login
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 sm:hidden">
          <button
            onClick={() => {
              alert("Mobile search would open here");
            }}
            className="text-blue-700 hover:text-orange-500"
          >
            <FontAwesomeIcon icon={faSearch} className="text-xl" />
          </button>
          <button
            onClick={toggleMenu}
            className="text-blue-700 hover:text-orange-500 focus:outline-none"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu (Visible on Mobile) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 right-0 bg-gradient-to-b from-blue-50 to-indigo-50 backdrop-blur-md px-6 py-4 flex flex-col space-y-4 md:hidden shadow-lg border-t border-blue-200"
        >
          <Link
            to="/"
            className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-4 py-2 rounded-lg transition duration-300 font-medium flex items-center"
            onClick={toggleMenu}
          >
            <span className="mr-2"></span> Home
          </Link>
          <a
            href="#about"
            className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-4 py-2 rounded-lg transition duration-300 font-medium flex items-center"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
              toggleMenu();
            }}
          >
            <span className="mr-2"></span> About
          </a>
          <a
            href="#features"
            className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-4 py-2 rounded-lg transition duration-300 font-medium flex items-center"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#features").scrollIntoView({ behavior: "smooth" });
              toggleMenu();
            }}
          >
            <span className="mr-2"></span> Features
          </a>
          <a
            href="#contact"
            className="text-blue-800 hover:text-orange-500 hover:bg-blue-100/50 px-4 py-2 rounded-lg transition duration-300 font-medium flex items-center"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
              toggleMenu();
            }}
          >
            <span className="mr-2"></span> Contact
          </a>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={() => {
                setShowModal(true);
                toggleMenu();
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 w-full shadow-md font-medium flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faUserAlt} className="mr-2" />
              Register
            </button>
            <button
              onClick={() => {
                navigate("/login");
                toggleMenu();
              }}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg hover:from-orange-600 hover:to-pink-600 transition duration-300 w-full shadow-md font-medium flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Login
            </button>
          </div>
        </motion.div>
      )}

{showModal && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
  <motion.div
  className="bg-gradient-to-br from-white to-blue-50 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md mx-auto text-center border border-blue-200 relative overflow-hidden"
  style={{
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'fixed',
    top: '50%',
    left: '30%',
    transform: 'translate(-50%, -50%)',
  }}
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", damping: 20, stiffness: 300 }}
>

            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-orange-500/10 rounded-full hidden sm:block"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/10 rounded-full hidden sm:block"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          Join Our Community
        </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Register as an NGO or Volunteer to start making a difference today!
              </p>
              
              <div className="space-y-4">
                <motion.button
                  onClick={() => {
                    setShowModal(false);
                    navigate("/register-ngo");
                  }}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center">
                    <FontAwesomeIcon icon={faHandsHelping} className="w-5 h-5 mr-3" />
                    NGO Organization
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setShowModal(false);
                    navigate("/register-volunteer");
                  }}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center">
                    <FontAwesomeIcon icon={faUserAlt} className="w-5 h-5 mr-3" />
                    Volunteer
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                </motion.button>
              </div>

              <motion.button
                onClick={() => setShowModal(false)}
                className="mt-6 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </motion.button>
              </div>
    </motion.div>
  </div>
)}
     
    </nav>
  );
};

export default Navbar;