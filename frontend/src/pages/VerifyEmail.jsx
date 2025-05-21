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
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link - missing parameters');
        return;
      }

      try {
        const response = await fetch(
          `https://volunteershub-project.onrender.com/api/auth/verify-email?token=${token}&email=${email}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setStatus('success');
        setMessage(data.message);
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

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