import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const HouseholdSelection: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to RentMate!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Hi {user?.firstName || "there"}, you're almost set! Now you need to
          either create a new household or join an existing one.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Household Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Create a New Household</h2>
          <p className="text-gray-600 mb-6">
            Start fresh with your own household. Invite roommates, track
            expenses, and manage chores together.
          </p>
          <div className="flex justify-center">
            <Link
              to="/household/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Household
            </Link>
          </div>
        </div>

        {/* Join Household Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">
            Join an Existing Household
          </h2>
          <p className="text-gray-600 mb-6">
            Have an invite code? Join your roommates' household and start
            collaborating right away.
          </p>
          <div className="flex justify-center">
            <Link
              to="/household/join"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Join Household
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500">
          You can always switch between households later from your profile
          settings.
        </p>
      </div>
    </div>
  );
};

export default HouseholdSelection;
