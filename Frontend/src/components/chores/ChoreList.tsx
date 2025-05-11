import React from "react";
import ChoreCard from "./ChoreCard";

interface ChoreListProps {
  chores: any[];
  loading: boolean;
  error: string | null;
  onEditChore: (chore: any) => void;
  onCompleteChore: (choreId: string, userId: string) => void;
}

const ChoreList: React.FC<ChoreListProps> = ({
  chores,
  loading,
  error,
  onEditChore,
  onCompleteChore,
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4 mx-auto"></div>
        <p className="text-gray-600 font-medium">Loading chores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (chores.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-md">
        <svg
          className="h-16 w-16 text-gray-300 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-gray-500 text-lg">No chores found</p>
        <p className="text-gray-400 mt-1">
          Add a new chore using the button above
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chores.map((chore) => (
        <ChoreCard
          key={chore.id}
          chore={chore}
          onEdit={() => onEditChore(chore)}
          onComplete={(choreId, userId) => onCompleteChore(choreId, userId)}
        />
      ))}
    </div>
  );
};

export default ChoreList;
