import React from "react";

interface ExpenseCardProps {
  expense: any;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  getCategoryColor: (category: string) => string;
  getCategoryIcon: (category: string) => string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onView,
  onDelete,
  getCategoryColor,
  getCategoryIcon,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`flex-shrink-0 h-10 w-10 rounded-md ${getCategoryColor(
              expense.category
            )} flex items-center justify-center`}
          >
            <span className="text-white text-lg">{getCategoryIcon(expense.category)}</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {expense.description}
            </h3>
            <div className="text-sm text-gray-500 flex items-center">
              <span>Paid by {expense.payerName}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(expense.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-lg font-semibold mr-4">₹{expense.amount.toFixed(2)}</div>
          <div className="flex space-x-1">
            <button
              onClick={onView}
              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
              title="View details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
              title="Edit expense"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
              title="Delete expense"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
