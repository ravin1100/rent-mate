import React from "react";
import { Link } from "react-router-dom";
import ExpenseCard from "./ExpenseCard";

interface ExpenseListProps {
  expenses: any[];
  loading: boolean;
  error: string | null;
  onEditExpense: (expense: any) => void;
  onViewExpense: (expense: any) => void;
  onDeleteExpense: (id: string) => void;
  getCategoryColor: (category: string) => string;
  getCategoryIcon: (category: string) => string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  loading,
  error,
  onEditExpense,
  onViewExpense,
  onDeleteExpense,
  getCategoryColor,
  getCategoryIcon,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (expenses.length === 0) {
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No expenses found
        </h3>
        <p className="text-gray-500 mb-6">
          Start tracking your household expenses by adding a new expense.
        </p>
        <Link
          to="/dashboard/expenses"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
          Add Expense
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onEdit={() => onEditExpense(expense)}
          onView={() => onViewExpense(expense)}
          onDelete={() => onDeleteExpense(expense.id)}
          getCategoryColor={getCategoryColor}
          getCategoryIcon={getCategoryIcon}
        />
      ))}
    </div>
  );
};

export default ExpenseList;
