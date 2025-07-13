import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../utils/auth';
import { LogOut } from 'lucide-react';

export const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.removeToken();
    localStorage.removeItem('userType');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}; 