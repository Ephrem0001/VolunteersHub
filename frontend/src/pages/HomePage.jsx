import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import conn from "./conn.jpeg";
import bgImage from "./np.jpg";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  faUser,
  faComment,
  faPaperPlane,
  faCalendarAlt,
  faUserPlus,
  faBell,
  faShieldAlt,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faHandsHelping,
  faUsers,
  faHeart,
  faGlobe,
  faChevronUp,
  faLightbulb,
  faChartLine,
  faRocket,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const images = [
  { src: bgImage, style: "brightness-75 contrast-125" },
];

const COLORS = {
  primary: {
    light: 'from-orange-400 to-orange-500',
    dark: 'from-orange-500 to-orange-600',
    hover: 'hover:from-orange-500 hover:to-orange-600',
    text: 'text-orange-500',
    bg: 'bg-orange-500',
    border: 'border-orange-500'
  },
  secondary: {
    light: 'from-blue-400 to-blue-500',
    dark: 'from-blue-500 to-blue-600',
    hover: 'hover:from-blue-500 hover:to-blue-600',
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-blue-500'
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-900',
    hover: 'hover:bg-gray-800'
  },
  light: {
    bg: 'bg-white',
    text: 'text-white',
    hover: 'hover:bg-gray-50'
  }
};

const HomePage = () => {
  // State declarations
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);

// Add this state near your other state declarations
const [formStatus, setFormStatus] = useState({
  show: false,
  message: '',
  type: '' // 'success' or 'error'
});
  // Refs
  const ref = useRef(null);
  const featuresRef = useRef(null);
  
  // Animation hooks
  const controls = useAnimation();
  const isInView = useInView(ref, { once: true });
  const [isFeaturesInView, setIsFeaturesInView] = useState(false);

  // Constants
  const subtitles = [
    "Connecting passion with purpose.",
    "Building stronger communities together.",
    "Amplifying impact through technology.",
    "Your journey to meaningful service starts here."
  ];

  const backgroundImages = [
    "https://images.unsplash.com/photo-1541535881962-3bb380b08458?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Hands together
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Food donation
    "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Community service
    "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // People volunteering
    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"  // Charity box
  ];
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
  }, 4000);
  return () => clearInterval(interval);
}, [backgroundImages.length]);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= subtitles[currentSubtitleIndex].length) {
        setTypedText(subtitles[currentSubtitleIndex].substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentSubtitleIndex((prev) => (prev + 1) % subtitles.length);
        }, 2000);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, [currentSubtitleIndex, subtitles]);

  // CountUp component for animated numbers // CountUp component for animated numbers
 
const testimonials = [
  {
    id: 1,
    name: "Mr.Daniel",
    role: "Volunteer Coordinator",
    content: "VolunteersHub has transformed how we manage our volunteer programs in Addis Ababa. We've connected with hundreds of passionate volunteers through this platform.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Tewodros Assefa",
    role: "Community Volunteer",
    content: "Through VolunteersHub, I've found opportunities to teach children in rural areas. The platform makes it easy to give back to my community.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    name: "Mekdes Solomon",
    role: "NGO Director",
    content: "The impact tracking features have helped our organization demonstrate the difference we're making in Ethiopian communities to our donors.",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 4,
    name: "Yohannes Girma",
    role: "Environmental Activist",
    content: "We've mobilized over 500 volunteers for our tree planting initiatives across Ethiopia using VolunteersHub. It's become essential to our work.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 5,
    name: "Selamawit Bekele",
    role: "Health Volunteer",
    content: "As a medical student, I've found meaningful opportunities to serve in rural clinics through VolunteersHub. It connects me with communities that need help.",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
  }
];
  // Features data
  const features = [
    {
      icon: faUserPlus,
      title: "Easy Registration",
      description: "Quick and simple sign-up process for both volunteers and organizations.",
      color: "text-blue-500"
    },
    {
      icon: faCalendarAlt,
      title: "Event Management",
      description: "Create, manage, and promote volunteer events with ease.",
      color: "text-purple-500"
    },
    {
      icon: faBell,
      title: "Smart Notifications",
      description: "Get alerts for new opportunities that match your interests.",
      color: "text-orange-500"
    },
    {
      icon: faChartLine,
      title: "Impact Tracking",
      description: "Measure and visualize the difference you're making in your community.",
      color: "text-green-500"
    },
    {
      icon: faShieldAlt,
      title: "Verified Organizations",
      description: "Work with trusted and vetted non-profit organizations.",
      color: "text-red-500"
    },
    {
      icon: faLightbulb,
      title: "Skill Matching",
      description: "Find opportunities that align with your unique skills and passions.",
      color: "text-yellow-500"
    }
  ];

  // Success stories data
  const successStories = [
    {
      title: "Community Cleanup Initiative",
      description: "Over 50 volunteers mobilized to clean up city parks, collecting 2 tons of waste.",
      impact: "15 parks renovated",
      image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46"
    },
    {
      title: "Literacy Program",
      description: "Volunteers provided reading support to 1,20 children in underprivileged schools.",
      impact: "85% improved reading scores",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350"
    },
    {
      title: "Disaster Relief",
      description: "Rapid response team delivered supplies to 3,00 families affected by floods.",
      impact: "10,00 meals distributed",
      image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46"
    }
  ];

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }

      // Check if features section is in view
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        setIsFeaturesInView(rect.top < window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Smooth scroll for anchor links
  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // Auto-rotation for testimonials and features
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    const featureInterval = setInterval(() => {
      if (isFeaturesInView) {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }
    }, 3000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(featureInterval);
    };
  }, [testimonials.length, features.length, isFeaturesInView]);

  // Animation when in view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Enhanced email validation
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call with better error handling
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% success rate for simulation
            resolve();
          } else {
            reject(new Error("Network error"));
          }
        }, 1000);
      });
      
      setIsSubscribed(true);
      setEmail("");
      
      // Reset subscription message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    } catch (err) {
      setError(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'https://volunteershub-6.onrender.com/api/contact',
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Show success tooltip
      setFormStatus({
        show: true,
        message: "Your message has been successfully sent!",
        type: "success"
      });
  
      // Reset form after successful submission
      reset();
  
      // Hide tooltip after 5 seconds
      setTimeout(() => {
        setFormStatus({ show: false, message: '', type: '' });
      }, 5000);
    } catch (error) {
      console.error('Full error:', error);
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please check your connection.";
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
  
      setFormStatus({
        show: true,
        message: errorMessage,
        type: "error"
      });
  
      setTimeout(() => {
        setFormStatus({ show: false, message: '', type: '' });
      }, 5000);
    }
  };
  const [currentImageIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= subtitles[currentSubtitleIndex].length) {
        setTypedText(subtitles[currentSubtitleIndex].substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentSubtitleIndex((prev) => (prev + 1) % subtitles.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentSubtitleIndex]);

  // Parallax effect for hero section
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interactive feature cards
 // Interactive feature cards
 const FeatureCard = ({ icon, title, description, color, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  return (
    <motion.div
      className={`relative overflow-hidden bg-white rounded-xl shadow-lg p-6 h-full transition-all duration-300 ${isHovered ? 'shadow-xl' : ''}`}
      onMouseEnter={() => {
        setIsHovered(true);
        controls.start({ y: -5, scale: 1.03 });
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        controls.start({ y: 0, scale: 1 });
      }}
      animate={controls}
      initial={{ y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>
      <motion.div
        className={`text-4xl mb-4 ${color}`}
        animate={isHovered ? { rotate: 10, scale: 1.1 } : { rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <FontAwesomeIcon icon={icon} />
      </motion.div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

  return (
    <div className="pt-0 overflow-x-hidden">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white text-2xl"
                onClick={() => setIsVideoModalOpen(false)}
              >
                &times;
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1, backgroundColor: "#EA580C" }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </motion.button>
      )}
 
<section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center text-white px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
  {/* Background Slideshow */}
  <div className="absolute inset-0 overflow-hidden">
    {backgroundImages.map((image, index) => (
      <motion.div
        key={index}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
          zIndex: 0
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: currentImage === index ? 1 : 0,
          scale: currentImage === index ? 1 : 1.05
        }}
        transition={{ 
          duration: 1.5,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-gray-900/80"></div>
      </motion.div>
    ))}
  </div>

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative z-10 w-full max-w-7xl mx-auto text-center mt-16 sm:mt-20"
  >
    <motion.h1
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <span className="block text-gray-300">Welcome to</span>
      <span className="block mt-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl animate-gradient bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
        VolunteersHub
      </span>
    </motion.h1>

    {/* Typing Effect */}
    <motion.div
      className="h-20 sm:h-24 mb-6 sm:mb-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light italic mb-2">
        {typedText}
        <span className="ml-1 inline-block w-1 h-6 bg-orange-400 animate-pulse"></span>
      </p>
      <p className="text-base sm:text-lg text-orange-200 font-medium">
        Empowering communities since 2015
      </p>
    </motion.div>

    {/* CTA Buttons */}
    <motion.div
      className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-16"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
    >
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="w-full sm:w-auto"
      >
        <Link
          to="/register-volunteer"
          className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group w-full sm:w-auto"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10 flex items-center">
            <FontAwesomeIcon icon={faHandsHelping} className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            Join as Volunteer
          </span>
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="w-full sm:w-auto"
      >
        <Link
          to="/register-ngo"
          className="relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group w-full sm:w-auto"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10 flex items-center">
            <FontAwesomeIcon icon={faUsers} className="h-6 w-6 mr-2" />
            Register Your NPOs
          </span>
        </Link>
      </motion.div>
    </motion.div>
  </motion.div>
</section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to bridge the gap between passionate volunteers and organizations making a difference. Our platform leverages technology to create meaningful connections that drive social change.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img src={conn} alt="Volunteers connecting" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Real Connections</h3>
                  <p className="text-gray-300">Building relationships that last</p>
                </div>
              </div>

              {/* Floating stats */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl font-bold text-orange-500 mb-1">92%</div>
                <div className="text-gray-600 text-sm">Satisfaction Rate</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {[
                  {
                    icon: faHeart,
                    title: "Passion-Driven",
                    content: "We believe in the power of passion to drive change. Our platform connects people who care with causes that matter."
                  },
                  {
                    icon: faGlobe,
                    title: "Community Focused",
                    content: "From local neighborhoods to global initiatives, we support projects at every scale that make our world better."
                  },
                  {
                    icon: faRocket,
                    title: "Innovative Approach",
                    content: "Using cutting-edge technology to solve age-old problems in volunteer coordination and community engagement."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                      <FontAwesomeIcon icon={item.icon} className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Designed to make volunteering easier, more effective, and more rewarding for everyone involved.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <FontAwesomeIcon icon={feature.icon} className="text-xl sm:text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive feature showcase */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={activeFeature}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{features[activeFeature].title}</h3>
                  <p className="text-gray-600 mb-6">{features[activeFeature].description}</p>
                  <div className="flex gap-2 mb-8">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-3 h-3 rounded-full ${index === activeFeature ? 'bg-orange-500' : 'bg-gray-300'}`}
                        aria-label={`Go to feature ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-300">
                    Learn more
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
              </div>
              <div className="bg-gray-100 flex items-center justify-center p-8">
                <motion.div
                  className="relative w-full h-64"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  key={activeFeature}
                >
                  {/* Placeholder for feature illustrations */}
                  <div className={`absolute inset-0 flex items-center justify-center text-9xl ${features[activeFeature].color}`}>
                    <FontAwesomeIcon icon={features[activeFeature].icon} />
                  </div>
                  <motion.div
                    className="absolute top-0 right-0 bg-white p-3 rounded-full shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FontAwesomeIcon icon={faSmile} className="text-yellow-400 text-xl" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-0 bg-white p-2 rounded-lg shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-xs font-medium text-gray-700">New!</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how VolunteersHub is making a real difference in communities around the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                    <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
                    <p className="text-gray-300 mb-3">{story.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 bg-orange-500 rounded-full"></span>
                      <span className="text-sm font-medium text-orange-300">{story.impact}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
  to="/success-stories"
  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg transition-colors duration-300"
>
  View All Success Stories
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
</Link>
          </motion.div>
        </div>
      </section>

    {/* Testimonials */}
<section className="py-20 bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold mb-4">What People Say</h2>
      <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Hear from volunteers and organizations who have transformed their communities with VolunteersHub.
      </p>
    </motion.div>

    <div className="max-w-4xl mx-auto relative">
      <div className="relative h-96 overflow-hidden">
        <AnimatePresence mode="wait">
          {testimonials.map((testimonial, index) => (
            activeTestimonial === index && (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
              >
                <div className="mb-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-500 mx-auto">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <blockquote className="text-xl md:text-2xl font-light italic mb-6">
                  "{testimonial.content}"
                </blockquote>
                <div className="text-orange-400 font-bold text-lg">{testimonial.name}</div>
                <div className="text-gray-400">{testimonial.role}</div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTestimonial(index)}
            className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === index ? 'bg-orange-500 w-6' : 'bg-gray-600'}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Join thousands of volunteers and organizations creating positive change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/register-volunteer"
                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faHandsHelping} className="h-6 w-6" />
                  Join as Volunteer
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  to="/register-ngo"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUsers} className="h-6 w-6" />
                  Register Your NPOs                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
<section id="contact" className="py-16 sm:py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12 sm:mb-16"
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
      <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
      <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
        Have questions or want to learn more? We'd love to hear from you.
      </p>
    </motion.div>

    <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Send us a message</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              {...register("subject", { required: "Subject is required" })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {errors.subject && (
              <p className="mt-1 text-red-500 text-sm">{errors.subject.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              {...register("message", { required: "Message is required" })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-orange-600 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Email</h4>
                <a 
                  href="mailto:Ethio@volunteershub.com" 
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                >
                  Ethio@volunteershub.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                <FontAwesomeIcon icon={faPhone} className="text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Phone</h4>
                <a 
                  href="tel:+987247190" 
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                >
                  +251 (987) 247-190
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Address</h4>
                <p className="text-gray-600">Addis Ababa, Ethiopia, CC 12345</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Follow Us</h3>
          <div className="flex justify-center gap-4 sm:gap-6">
            {[
              { icon: faFacebook, color: "text-blue-600", url: "#" },
              { icon: faTwitter, color: "text-blue-400", url: "#" },
              { icon: faInstagram, color: "text-pink-500", url: "#" },
              { icon: faLinkedin, color: "text-blue-700", url: "#" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-3xl ${social.color} hover:opacity-80 transition-opacity duration-300`}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={social.icon} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">VolunteersHub</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Connecting passionate volunteers with organizations making a difference in communities worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { name: "Home", url: "#" },
                  { name: "About", url: "#about" },
                  { name: "Features", url: "#features" },
                  { name: "Contact", url: "#contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url} 
                      onClick={(e) => handleAnchorClick(e, link.url.substring(1))}
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {[
                  { name: "Blog", url: "#" },
                  { name: "Success Stories", url: "#" },
                  { name: "Volunteer Guide", url: "#" },
                  { name: "NGO Resources", url: "#" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url} 
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { name: "Privacy Policy", url: "#" },
                  { name: "Terms of Service", url: "#" },
                  { name: "Cookie Policy", url: "#" }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url} 
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-gray-800 text-center text-gray-400">
            <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} VolunteersHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
