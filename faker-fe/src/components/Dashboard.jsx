import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="fixed inset-0 w-full h-full overflow-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <img 
                src={user?.avatar} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full ring-2 ring-white"
              />
              <span className="text-sm text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 h-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
          <div className="flex items-center gap-6">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-lg"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600 mt-1">Steam ID: {user?.id}</p>
              {user?.realName && (
                <p className="text-gray-600 mt-1">Real Name: {user.realName}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;