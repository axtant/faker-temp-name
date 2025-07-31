import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      await authService.handleCallback(searchParams);
      navigate('/dashboard');
    } catch (error) {
      setError('Authentication failed. Please try again.');
      setTimeout(() => navigate('/'), 3000);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 via-red-400 to-pink-400">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-lg mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <span className="text-white text-4xl">❌</span>
            </div>
            <p className="text-xl text-gray-800 mb-4">{error}</p>
            <p className="text-sm text-gray-600">Redirecting you back...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-lg mx-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center animate-spin">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-xl text-gray-800">Authenticating...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we verify your credentials</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;