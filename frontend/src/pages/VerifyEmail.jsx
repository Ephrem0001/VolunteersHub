import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  // ✅ Prevent double API call in React 18 dev mode
  const calledOnce = useRef(false);

  useEffect(() => {
    if (calledOnce.current) return;
    calledOnce.current = true;

    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link - missing parameters');
        return;
      }

      try {
        const res = await axios.get(
          `https://volunteershub-6.onrender.com/api/auth/verify-email`,
          {
            params: {
              token,
              email,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // On success
        setStatus('success');
        setMessage(res.data.message);
        if (res.data.token) {
          localStorage.setItem('authToken', res.data.token);
        }

        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        console.error(error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 'Server error during verification'
        );
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
            <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-xl font-bold">Verification Failed</h2>
            <p className="mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
