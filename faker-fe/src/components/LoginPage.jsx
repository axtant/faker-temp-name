import React from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
      {/* Playful floating shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-300 opacity-20 rounded-full blur-2xl animate-pulse"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-lg mx-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl font-extrabold drop-shadow">F</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600 mb-8 text-lg">Sign in with Steam to continue</p>
          <button
            onClick={login}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg hover:scale-105"
          >
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center shadow">
              <span className="text-white text-lg font-bold">S</span>
            </div>
            <span className="text-lg">Sign in with Steam</span>
          </button>
          <p className="mt-4 text-xs text-gray-500">
            Please use your email associated with Steam for authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;