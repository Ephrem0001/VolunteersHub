import React from "react";

const Termsandcondition = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Terms and Conditions</h1>
        <p className="text-gray-600 text-sm mb-4">Effective Date: [Insert Date]</p>
        
        <p className="mb-4">
          Welcome to [Your Website Name], an event management platform for NGOs. By accessing or using our services,
          you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-700 mt-6">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By registering, accessing, or using our website, you acknowledge that you have read, understood, and agreed
          to be bound by these Terms and Conditions.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-700 mt-6">2. Eligibility</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>You must be at least 18 years old to register and use our services.</li>
          <li>Your NGO must be a legally recognized organization.</li>
          <li>You agree to provide accurate and complete registration information.</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-gray-700 mt-6">3. Account Registration & Security</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your login credentials. Notify us immediately if
          you suspect any unauthorized access.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">4. Use of Services</h2>
        <p className="mb-4">
          Our platform is intended to facilitate event planning, volunteer engagement, and fundraising for NGOs. Any
          misuse of the platform, including spamming or fraudulent activities, may result in account suspension.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-700 mt-6">5. Event Management & Listings</h2>
        <p className="mb-4">
          NGOs are responsible for the accuracy and legality of the events they create. Events that promote hate speech,
          discrimination, or illegal activities will be removed.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">6. Privacy and Data Protection</h2>
        <p className="mb-4">
          Your personal information is protected under our <a href="/privacypolicy" className="text-purple-600 underline">Privacy Policy</a>. We do not sell or share user data without consent.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">7. Payment and Donations</h2>
        <p className="mb-4">
          Our platform may allow NGOs to collect donations, which are processed through third-party services. We are not responsible for transaction issues.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">8. Intellectual Property</h2>
        <p className="mb-4">
          All content, trademarks, and materials on this website belong to [Your Website Name] or respective NGOs. Users are prohibited from copying, distributing, or modifying any content without permission.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">9. Limitation of Liability</h2>
        <p className="mb-4">
          We do not guarantee uninterrupted access to our platform and are not liable for any direct, indirect, or incidental damages arising from the use of our services.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">10. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms periodically. Continued use of the platform after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">11. Contact Information</h2>
        <p>
          If you have any questions regarding these Terms, please contact us at <a href="mailto:contact@yourwebsite.com" className="text-purple-600 underline">contact@yourwebsite.com</a>.
        </p>
      </div>
    </div>
  );
};

export default Termsandcondition;
