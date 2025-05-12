import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes, faHandsHelping, faUserAlt,faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    setSearchQuery("");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-gray-900/95 backdrop-blur-sm shadow-lg" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              VolunteersHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {[
              { name: "Home", href: "#" },
              { name: "About", href: "#about" },
              { name: "Features", href: "#features" },
              { name: "Contact", href: "#contact" }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm lg:text-base"
              >
                {item.name}
              </a>
            ))}
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 whitespace-nowrap"
            >
              Login
            </Link>
            <motion.button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-lg text-sm lg:text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30 whitespace-nowrap"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Register
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-orange-400 transition-colors duration-300 p-2"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
          <div className="px-3 py-2 space-y-1 sm:px-4">
            {[
              { name: "Home", href: "#" },
              { name: "About", href: "#about" },
              { name: "Features", href: "#features" },
              { name: "Contact", href: "#contact" }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                className="block px-3 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-center font-medium transition-all duration-300 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <button
                onClick={() => {
                  setShowModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg text-center font-medium transition-all duration-300 text-sm sm:text-base"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            className="bg-gradient-to-br from-white to-blue-50 p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md mx-auto text-center border border-blue-200 relative overflow-hidden"
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
                Register as an NPO or Volunteer to start making a difference today!
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