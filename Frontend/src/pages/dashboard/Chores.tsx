import React, { useState, useEffect } from "react";
import { householdApi, useHousehold } from "../../contexts/HouseholdContext";
import { useAuth } from "../../contexts/AuthContext";
import ChoreModal from "../../components/chores/ChoreModal";
import ChoreList from "../../components/chores/ChoreList";
import ChoreLogs from "../../components/chores/ChoreLogs";
import ChoreHistory from "../../components/chores/ChoreHistory";
import ChoreFilter from "../../components/chores/ChoreFilter";

const Chores: React.FC = () => {
  const { household } = useHousehold();
  const { user } = useAuth();
  const [chores, setChores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChore, setSelectedChore] = useState<any | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string>("all");

  // Tab state
  const [activeTab, setActiveTab] = useState<"chores" | "logs">("chores");

  // Fetch chores from the API
  const fetchChores = async (userIds?: number[]) => {
    if (!household) return;

    try {
      setLoading(true);
      setError(null);

      // Build query parameters for filtering
      let queryParams = "";
      if (userIds && userIds.length > 0) {
        queryParams += userIds.map((id) => `userIds=${id}`).join("&");
      }

      // Add query parameters if they exist
      const url = `/api/chores/household/all-chores${
        queryParams ? `?${queryParams}` : ""
      }`;

      const response = await householdApi.get(url);
      
      // Process the chores data to ensure dates are properly formatted
      const processedChores = response.data.map((chore: any) => ({
        ...chore,
        // Ensure dueDate is a proper date object
        dueDate: chore.dueDate ? new Date(chore.dueDate) : null,
        // Format completedAt if it exists
        completedAt: chore.completedAt ? new Date(chore.completedAt) : null
      }));
      
      setChores(processedChores);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch chores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (household) {
      // Only apply user filter if a specific user is selected
      const userIds =
        filterAssignee !== "all" ? [parseInt(filterAssignee)] : undefined;

      fetchChores(userIds);
    }
  }, [household, filterAssignee]);

  // Handle editing a chore
  const handleEditChore = (chore: any) => {
    setSelectedChore(chore);
    setIsModalOpen(true);
  };

  // Handle adding a new chore
  const handleAddChore = () => {
    setSelectedChore(null);
    setIsModalOpen(true);
  };

  // Handle completing a chore
  const handleCompleteChore = async (id: string, userId: string) => {
    try {
      // Call the /api/chores/done endpoint with choreId and userId as query parameters
      await householdApi.post(`/api/chores/done?choreId=${id}`);
      fetchChores(); // Refresh the list
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to mark chore as completed"
      );
    }
  };

  // Handle successful chore creation/update
  const handleChoreSuccess = () => {
    fetchChores();
  };

  if (!household) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Household Found</h2>
          <p>You need to create or join a household to manage chores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Household Chores</h1>
            <p className="text-blue-100 mt-1">
              Manage and track chores for your household
            </p>
          </div>
          <button
            onClick={handleAddChore}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 shadow-md flex items-center font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Chore
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("chores")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "chores"
                ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50"
                : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Chores
            </div>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "logs"
                ? "text-indigo-600 border-b-2 border-indigo-500 bg-indigo-50"
                : "text-gray-500 hover:text-indigo-500 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Logs
            </div>
          </button>
        </div>
      </div>

      {/* Chores Tab Content */}
      {activeTab === "chores" && (
        <>
          <ChoreFilter
            filterAssignee={filterAssignee}
            setFilterAssignee={setFilterAssignee}
            household={household}
          />

          <ChoreList
            chores={chores}
            loading={loading}
            error={error}
            onEditChore={handleEditChore}
            onCompleteChore={handleCompleteChore}
          />

          <ChoreHistory household={household} />
        </>
      )}

      {/* Logs Tab Content */}
      {activeTab === "logs" && (
        <ChoreLogs chores={chores} household={household} />
      )}

      {/* Chore Modal */}
      {isModalOpen && (
        <ChoreModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedChore={selectedChore}
          household={household}
          onSuccess={handleChoreSuccess}
        />
      )}
    </div>
  );
};

export default Chores;
