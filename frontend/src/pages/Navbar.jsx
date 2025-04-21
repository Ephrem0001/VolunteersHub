import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

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

    <nav className="fixed w-full top-0 z-50 shadow-lg bg-white/90 backdrop-blur-md py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 md:w-64 px-4 py-2 bg-transparent text-black placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 transition duration-300"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </motion.form>

        {/* Centered Navigation Links (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <motion.ul
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
            className="flex space-x-8"
          >
            <motion.li variants={itemVariants}>
              <Link
                to="/"
                className="text-black hover:text-orange-500 hover:underline transition duration-300 text-sm md:text-base"
              >
                Home
              </Link>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a
                href="#about"
                className="text-black hover:text-orange-500 hover:underline transition duration-300 text-sm md:text-base"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
                }}
              >
                About Us
              </a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a
                href="#features"
                className="text-black hover:text-orange-500 hover:underline transition duration-300 text-sm md:text-base"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#features").scrollIntoView({ behavior: "smooth" });
                }}
              >
                Features
              </a>
            </motion.li>
            <motion.li variants={itemVariants}>
              <a
                href="#contact"
                className="text-black hover:text-orange-500 hover:underline transition duration-300 text-sm md:text-base"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact Us
              </a>
            </motion.li>
          </motion.ul>
        </div>

        {/* Right Side: Buttons (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.button
            variants={itemVariants}
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 transition duration-300 shadow-md text-sm md:text-base"
          >
            Register
          </motion.button>

          <motion.button
            variants={itemVariants}
            onClick={() => navigate("/login")}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 hover:scale-105 transition duration-300 shadow-md text-sm md:text-base"
          >
            Login
          </motion.button>
        </div>

        {/* Mobile Search and Menu Button */}
        <div className="flex items-center space-x-4 sm:hidden">
          <button
            onClick={() => {
              // Implement mobile search functionality
              alert("Mobile search would open here");
            }}
            className="text-gray-700"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu (Visible on Mobile) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col space-y-4 md:hidden shadow-lg border-t border-gray-200"
        >
          <Link
            to="/"
            className="text-black hover:text-orange-500 transition duration-300 py-2"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <a
            href="#about"
            className="text-black hover:text-orange-500 transition duration-300 py-2"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
              toggleMenu();
            }}
          >
            About Us
          </a>
          <a
            href="#features"
            className="text-black hover:text-orange-500 transition duration-300 py-2"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#features").scrollIntoView({ behavior: "smooth" });
              toggleMenu();
            }}
          >
            Features
          </a>
          <a
            href="#contact"
            className="text-black hover:text-orange-500 transition duration-300 py-2"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
              toggleMenu();
            }}
          >
            Contact Us
          </a>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={() => {
                setShowModal(true);
                toggleMenu();
              }}
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full shadow-md"
            >
              Register
            </button>
            <button
              onClick={() => {
                navigate("/login");
                toggleMenu();
              }}
              className="bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition duration-300 w-full shadow-md"
            >
              Login
            </button>
          </div>
        </motion.div>
      )}

      {/* Registration Choice Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md mx-4 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Register as</h2>
            <div className="space-y-3 sm:space-y-4">
              <motion.button
                onClick={() => {
                  setShowModal(false);
                  navigate("/register-ngo");
                }}
                className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md"
                whileHover={{ scale: 1.03 }}
              >
                NGO
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowModal(false);
                  navigate("/register-volunteer");
                }}
                className="w-full bg-teal-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-md"
                whileHover={{ scale: 1.03 }}
              >
                Volunteer
              </motion.button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </nav>
    
  );
};

export default Navbar;