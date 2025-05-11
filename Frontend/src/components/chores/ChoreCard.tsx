import React from "react";

interface ChoreCardProps {
  chore: any;
  onEdit: () => void;
  onComplete: (choreId: string, userId: string) => void;
}

const ChoreCard: React.FC<ChoreCardProps> = ({
  chore,
  onEdit,
  onComplete,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
        chore.completedAt ? "border-l-4 border-green-500" : ""
      }`}
    >
      <div className="p-6">
        {/* Status Badge - Top Right */}
        <div className="flex justify-between items-center mb-3">
          <h3
            className={`text-xl font-semibold ${
              chore.completedAt ? "text-gray-500" : "text-gray-800"
            }`}
          >
            {chore.name}
          </h3>
        </div>

        {chore.description && (
          <p
            className={`mt-2 text-sm ${
              chore.completedAt ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {chore.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {chore.frequency.charAt(0).toUpperCase() +
              chore.frequency.slice(1).toLowerCase()}
          </span>

          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Due: {new Date(chore.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        {/* Assignment Section with Visual Indicators */}
        <div className="mt-4 border-t pt-3">
          {/* Current Assignment */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2">
              {chore.assignedUserName
                ? chore.assignedUserName.charAt(0).toUpperCase()
                : "?"}
            </div>
            <div>
              <p className="text-sm font-medium">Currently Assigned</p>
              <p className="text-sm text-gray-600">
                {chore.assignedUserName || "Unassigned"}
              </p>
            </div>
          </div>

          {/* Rotation Visualization */}
          {chore?.allowedMembers?.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Rotation Order:</p>
              <div className="flex flex-wrap gap-1">
                {chore.allowedMembers.map((member: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center px-2 py-1 rounded-full text-xs ${
                      member.name === chore.assignedUserName
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {member.name}
                    {member.name === chore.assignedUserName && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Information */}
          {chore.completedAt && chore.completedBy && (
            <div className="mt-3 bg-green-50 p-2 rounded-md">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-xs text-green-700">
                  Completed by{" "}
                  <span className="font-medium">{chore.completedBy}</span> on{" "}
                  {new Date(chore.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3 border-t pt-4">
          {!chore.completedAt && (
            <button
              onClick={() => onComplete(chore.id, chore.assignedUserId)}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Mark as Done
            </button>
          )}

          <button
            onClick={onEdit}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoreCard;
