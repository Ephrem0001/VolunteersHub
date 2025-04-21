import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NgoHome = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">VolunteerHub for NGOs</h1>
          <div className="space-x-6">
            <a href="#about" className="hover:underline">About Us</a>
            <a href="#features" className="hover:underline">Features</a>
            <a href="#contact" className="hover:underline">Contact Us</a>
            <Link to="/register-ngo" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Register</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <header className="bg-gray-100 py-32 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-5xl font-bold text-blue-600 mb-6">
            Empowering NGOs to Create Impactful Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            VolunteerHub provides NGOs with the tools and resources to organize, manage, and promote events that drive meaningful change in communities.
          </p>
          <Link
            to="/register-ngo"
            className="inline-block bg-green-600 text-white px-8 py-3 mt-8 rounded-lg hover:bg-green-700 hover:scale-105 transition-transform duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </header>

      <section id="about" className="container mx-auto my-20 px-6">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <h2 className="text-4xl font-semibold text-blue-600 text-center mb-8">About Us</h2>
    <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-8">
      At VolunteerHub, we believe in the power of collective action to drive meaningful change. Our platform bridges the gap between NGOs and passionate volunteers, creating a space where impactful events are organized, and volunteers can contribute to causes they care about.
    </p>

    {/* Mission */}
    <div className="bg-white p-8 shadow-lg rounded-lg mb-8">
      <h3 className="text-2xl font-semibold text-blue-600 mb-4">Our Mission</h3>
      <p className="text-gray-600">
        To empower NGOs and volunteers by providing a seamless platform for organizing and participating in events that create a positive impact in communities.
      </p>
    </div>

    {/* For Volunteers */}
    <div className="bg-white p-8 shadow-lg rounded-lg mb-8">
      <h3 className="text-2xl font-semibold text-blue-600 mb-4">For Volunteers</h3>
      <p className="text-gray-600">
        Discover events that align with your passions, connect with NGOs, and make a difference in your community. Track your contributions and grow as a volunteer.
      </p>
    </div>

    {/* For NGOs */}
    <div className="bg-white p-8 shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-blue-600 mb-4">For NGOs</h3>
      <p className="text-gray-600">
        Organize events efficiently, connect with dedicated volunteers, and amplify your impact. VolunteerHub simplifies event management so you can focus on your mission.
      </p>
    </div>
  </motion.div>
</section>

      {/* ✅ Features */}
      <section id="features" className="bg-gray-100 py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-semibold text-blue-600 text-center mb-12">Our Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 shadow-lg rounded-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Event Creation</h3>
                <p className="text-gray-600">
                  Easily create and manage events with detailed descriptions, schedules, and volunteer requirements.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 shadow-lg rounded-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Volunteer Management</h3>
                <p className="text-gray-600">
                  Track volunteer sign-ups, manage participation, and communicate with your team in real-time.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 shadow-lg rounded-lg"
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Promotion Tools</h3>
                <p className="text-gray-600">
                  Promote your events effectively with built-in tools for social media sharing and email campaigns.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ✅ Contact Us */}
      <section id="contact" className="container mx-auto my-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-semibold text-blue-600 text-center mb-8">Contact Us</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
            Have questions or want to collaborate? Reach out to us! We’re here to help you make a difference.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h3>
              <p className="text-gray-600 mb-4">
                <strong>Email:</strong> support@volunteerhub.com
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Phone:</strong> +251 123 456 789
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> Addis Ababa, Ethiopia
              </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ✅ Footer */}
      <footer className="bg-blue-600 text-white py-8 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 VolunteerHub. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NgoHome;