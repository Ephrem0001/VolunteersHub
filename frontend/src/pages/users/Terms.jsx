import React from 'react';
const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Volunteer Terms and Conditions</h1>
      
      <p className="mb-4">
        Thank you for your interest in volunteering through our NGO Event Management Platform. By signing up as a volunteer, you agree to the following terms:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li><strong>Voluntary Participation:</strong> Your involvement is entirely voluntary and you will not receive financial compensation for your service.</li>
        <li><strong>Accurate Information:</strong> You agree to provide truthful and accurate personal details during registration.</li>
        <li><strong>Commitment:</strong> Once you sign up for an event, we expect timely attendance and communication in case of cancellation or delay.</li>
        <li><strong>Respect and Behavior:</strong> You will treat all individuals—fellow volunteers, event organizers, and attendees—with respect and kindness.</li>
        <li><strong>Confidentiality:</strong> Any sensitive information you may access during your service must be kept confidential.</li>
        <li><strong>Use of Personal Data:</strong> Your data will only be used for managing volunteer events and communication, in compliance with our Privacy Policy.</li>
        <li><strong>Photography & Media:</strong> Photos or videos may be taken during events. If you wish to opt out, please notify the organizer in advance.</li>
        <li><strong>Liability:</strong> The platform and organizers are not liable for personal injury, loss, or damage during participation unless due to gross negligence.</li>
      </ul>

      <p className="mt-6">
        By continuing, you confirm that you have read, understood, and agree to abide by these terms as a volunteer.
      </p>
    </div>
  );
};
export default Terms;
