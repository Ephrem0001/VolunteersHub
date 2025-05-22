import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-orange-500">
            VolunteersHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              About Us
            </Link>
            <Link to="/features" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              Features
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-500 transition-colors duration-300">
              Contact
            </Link>
            <div className="flex space-x-4">
              <Link 
                to="/register-volunteer" 
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
              >
                Join as Volunteer
              </Link>
              <Link 
                to="/register-ngo" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Register NGO
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-orange-500 focus:outline-none"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-6 py-4 space-y-4">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-orange-500 transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-orange-500 transition-colors duration-300"
            >
              About Us
            </Link>
            <Link 
              to="/features" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-orange-500 transition-colors duration-300"
            >
              Features
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-orange-500 transition-colors duration-300"
            >
              Contact
            </Link>
            <div className="pt-4 space-y-2">
              <Link 
                to="/register-volunteer" 
                onClick={() => setIsMenuOpen(false)}
                className="block bg-orange-500 text-white px-4 py-2 rounded-lg text-center hover:bg-orange-600 transition-colors duration-300"
              >
                Join as Volunteer
              </Link>
              <Link 
                to="/register-ngo" 
                onClick={() => setIsMenuOpen(false)}
                className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors duration-300"
              >
                Register NGO
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
