import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');
useEffect(() => {
  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `https://volunteershub-6.onrender.com/api/auth/verify-email?token=${token}&email=${email}`
      );
      
      const data = await response.json();
      console.log("API Response:", data); // Debug log
      
      if (!response.ok) throw new Error(data.message);
      
      // Add this debug check:
      const dbCheck = await fetch(`/api/users/${email}`);
      const dbData = await dbCheck.json();
      console.log("Database Status:", dbData.verified);
      
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };
  verifyEmail();
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-bold">Verifying Email</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-bold">Verification Successful!</h2>
            <p>{message}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
          
            <h2 className="text-xl font-bold">Verification Successful</h2>
            {/* <p className="mb-6">{message}</p> */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Go to Login
              </button>
             
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;