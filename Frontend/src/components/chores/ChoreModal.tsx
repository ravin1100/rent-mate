import React, { useState, useEffect } from "react";
import { householdApi } from "../../contexts/HouseholdContext";

interface ChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChore: any | null;
  household: any;
  onSuccess: () => void;
}

const ChoreModal: React.FC<ChoreModalProps> = ({
  isOpen,
  onClose,
  selectedChore,
  household,
  onSuccess,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [newChore, setNewChore] = useState({
    name: "",
    frequency: "DAILY",
    householdId: household?.id || 0,
    allowedMemebers: [] as number[],
  });

  // Initialize form when modal opens or selectedChore changes
  useEffect(() => {
    if (selectedChore) {
      // Edit mode - populate form with selected chore data
      setNewChore({
        name: selectedChore.name || "",
        frequency: selectedChore.frequency || "DAILY",
        householdId: household?.id || 0,
        allowedMemebers: selectedChore.allowedMembers
          ? selectedChore.allowedMembers.map((member: any) => member.id)
          : [],
      });
    } else {
      // Add mode - reset form
      setNewChore({
        name: "",
        frequency: "DAILY",
        householdId: household?.id || 0,
        allowedMemebers: [],
      });
    }
  }, [selectedChore, household]);

  const handleChoreInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewChore((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberSelection = (memberId: number) => {
    setNewChore((prev) => {
      const allowedMemebers = [...prev.allowedMemebers];
      const index = allowedMemebers.indexOf(memberId);

      if (index > -1) {
        // Remove member if already selected
        allowedMemebers.splice(index, 1);
      } else {
        // Add member if not selected
        allowedMemebers.push(memberId);
      }

      return {
        ...prev,
        allowedMemebers,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (selectedChore) {
        // Update existing chore
        await householdApi.put(`/api/chores/${selectedChore.id}`, {
          ...newChore,
          householdId: household?.id,
        });
      } else {
        // Create new chore
        await householdApi.post("/api/chores/create", {
          ...newChore,
        });
      }

      // Close modal and refresh chores
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Failed to ${selectedChore ? "update" : "create"} chore`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {selectedChore ? "Edit Chore" : "Add New Chore"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chore Name
              </label>
              <input
                type="text"
                name="name"
                value={newChore.name}
                onChange={handleChoreInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter chore name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                name="frequency"
                value={newChore.frequency}
                onChange={handleChoreInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Members
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {household?.members?.map((member: any) => (
                    <div
                      key={member.id}
                      className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ${
                        newChore.allowedMemebers.includes(member.id)
                          ? "bg-indigo-100 border border-indigo-300 shadow-sm"
                          : "bg-white border border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => handleMemberSelection(member.id)}
                    >
                      <div className="flex items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${
                            newChore.allowedMemebers.includes(member.id)
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {member.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="ml-2">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          checked={newChore.allowedMemebers.includes(member.id)}
                          onChange={() => handleMemberSelection(member.id)}
                          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : selectedChore ? (
                  "Update Chore"
                ) : (
                  "Add Chore"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChoreModal;
