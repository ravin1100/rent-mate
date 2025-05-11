import React from "react";

interface ExpenseBalancesProps {
  netBalances: any[];
  loadingBalances: boolean;
  settleUpSuggestions: any[];
  loadingSettleUpSuggestions: boolean;
}

const ExpenseBalances: React.FC<ExpenseBalancesProps> = ({
  netBalances,
  loadingBalances,
  settleUpSuggestions,
  loadingSettleUpSuggestions,
}) => {
  if (loadingBalances) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading balances...</p>
      </div>
    );
  }

  if (netBalances.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No balances found
        </h3>
        <p className="text-gray-500">
          Start tracking expenses to see balances between household members.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Net Balances */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-500 mb-4">NET BALANCES</h4>
        <div className="space-y-4">
          {netBalances.map((balance) => {
            const isPositive = balance.netBalance >= 0;
            return (
              <div
                key={`balance-${balance.userId}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full ${
                      isPositive ? "bg-green-100" : "bg-orange-100"
                    } flex items-center justify-center`}
                  >
                    <span
                      className={`${
                        isPositive ? "text-green-600" : "text-orange-600"
                      } font-medium`}
                    >
                      {balance.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{balance.name}</p>
                    <p className="text-sm text-gray-500">
                      {isPositive ? "is owed money" : "owes money"}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-lg font-bold ${
                    isPositive ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  ₹{Math.abs(balance.netBalance).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settlement suggestions from API */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-500 mb-4">
          SUGGESTED SETTLEMENTS
        </h4>
        {loadingSettleUpSuggestions ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        ) : settleUpSuggestions.length > 0 ? (
          <div className="space-y-4">
            {settleUpSuggestions.map((suggestion, index) => (
              <div
                key={`settlement-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-medium">
                      {suggestion.fromUserName.charAt(0)}
                    </span>
                  </div>
                  <div className="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-medium">
                      {suggestion.toUserName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {suggestion.fromUserName} pays {suggestion.toUserName}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-gray-800">
                  ₹{suggestion.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic py-2">
            No settlements needed at this time
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseBalances;
