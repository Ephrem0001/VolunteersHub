import React from "react";

const Privacypolicy = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 text-sm mb-4">Effective Date: [Insert Date]</p>
        
        <p className="mb-4">
          Welcome to [Your Website Name]. Your privacy is important to us. This Privacy Policy explains how we collect,
          use, and protect your information when you use our event management platform for NGOs.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">1. Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Personal Information: Name, email, organization details, and contact information.</li>
          <li>Event Information: Details of events you create or participate in.</li>
          <li>Payment Information: If you make a donation, payment details are collected by third-party services.</li>
          <li>Usage Data: IP addresses, browser type, and activity on our platform.</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-gray-700 mt-6">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your data to provide and improve our services, including:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Facilitating event registration and management.</li>
          <li>Sending updates, notifications, and support-related messages.</li>
          <li>Improving our platform based on user interactions.</li>
          <li>Ensuring security and preventing fraud.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">3. Data Sharing and Security</h2>
        <p className="mb-4">
          - We do not sell or rent your personal information to third parties.<br />
          - Data may be shared with trusted third-party service providers for platform functionality (e.g., payment processing).<br />
          - We use encryption and security protocols to protect user data.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">4. Cookies and Tracking</h2>
        <p className="mb-4">
          We use cookies to enhance your experience, track usage, and improve website functionality. You can disable
          cookies in your browser settings.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Request access to your personal data.</li>
          <li>Correct or update inaccurate information.</li>
          <li>Request deletion of your data (subject to legal obligations).</li>
          <li>Opt out of marketing communications.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">6. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy periodically. Any changes will be posted on this page.
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mt-6">7. Contact Us</h2>
        <p>
          If you have any questions regarding this Privacy Policy, please contact us at
          <a href="mailto:contact@yourwebsite.com" className="text-purple-600 underline"> belayketemateme44@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default Privacypolicy;
