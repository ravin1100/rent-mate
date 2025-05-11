import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicNavbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                RentMate
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/pricing"
              className={`${
                location.pathname === '/pricing'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Pricing
            </Link>
            <Link
              to="/about-us"
              className={`${
                location.pathname === '/about-us'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              About Us
            </Link>
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
