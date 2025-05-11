import React, { useState } from "react";
import { useHousehold } from "../../contexts/HouseholdContext";

interface HouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HouseholdModal: React.FC<HouseholdModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createHousehold, joinHousehold } = useHousehold();

  if (!isOpen) return null;

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await createHousehold(householdName);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create household");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await joinHousehold(inviteCode);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to join household");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Welcome to RentMate!
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            To get started, you need to either create a new household or join an
            existing one.
          </p>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex">
              <button
                className={`${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                onClick={() => setActiveTab("create")}
              >
                Create Household
              </button>
              <button
                className={`${
                  activeTab === "join"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm flex-1 text-center`}
                onClick={() => setActiveTab("join")}
              >
                Join Household
              </button>
            </nav>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Create Household Form */}
          {activeTab === "create" && (
            <form onSubmit={handleCreateHousehold} className="space-y-4">
              <div>
                <label
                  htmlFor="householdName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Household Name
                </label>
                <input
                  type="text"
                  id="householdName"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Apartment 42"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Household"}
              </button>
            </form>
          )}

          {/* Join Household Form */}
          {activeTab === "join" && (
            <form onSubmit={handleJoinHousehold} className="space-y-4">
              <div>
                <label
                  htmlFor="inviteCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Invite Code
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter the invite code"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Household"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseholdModal;
