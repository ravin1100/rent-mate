import { parseCustomDateString } from "../../utils/dateUtils";
import React, { useState, useEffect } from "react";
import { householdApi, useHousehold } from "../../contexts/HouseholdContext";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import ExpenseModal from "../../components/expenses/ExpenseModal";
import ExpenseList from "../../components/expenses/ExpenseList";
import ExpenseFilter from "../../components/expenses/ExpenseFilter";
import ExpenseBalances from "../../components/expenses/ExpenseBalances";
// import { Expense } from '../../models/Expense';

const Expenses: React.FC = () => {
  const { household } = useHousehold();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [filterPaidBy, setFilterPaidBy] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDateRange, setFilterDateRange] = useState<
    "all" | "week" | "month" | "year"
  >("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"expenses" | "balances">(
    searchParams.get("tab") === "balances" ? "balances" : "expenses"
  );
  const [balances, setBalances] = useState<any[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [netBalances, setNetBalances] = useState<any[]>([]);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);
  const [settleUpSuggestions, setSettleUpSuggestions] = useState<any[]>([]);
  const [loadingSettleUpSuggestions, setLoadingSettleUpSuggestions] =
    useState(false);

  // Function to fetch expenses from the API
  const fetchExpenses = async () => {
    if (!household) return;

    try {
      setLoading(true);

      // Fetch expenses from the API using the correct endpoint
      const response = await householdApi.get(`/api/expenses/get-all`);
      setExpenses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch balances from the API
  const fetchBalances = async () => {
    if (!household) return;

    try {
      setLoadingBalances(true);

      // Fetch net balances from the API
      const response = await householdApi.get(`/api/settlement/balances`);
      setNetBalances(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch balances");
    } finally {
      setLoadingBalances(false);
    }
  };

  // Function to fetch settle-up suggestions
  const fetchSettleUpSuggestions = async () => {
    if (!household) return;

    try {
      setLoadingSettleUpSuggestions(true);

      // Fetch settle-up suggestions from the API
      const response = await householdApi.get(
        `/api/settlement/settle-up-suggestion`
      );
      setSettleUpSuggestions(response.data);
      setIsSettleUpModalOpen(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch settle-up suggestions"
      );
    } finally {
      setLoadingSettleUpSuggestions(false);
    }
  };

  useEffect(() => {
    if (household) {
      fetchExpenses();
      fetchBalances();
      fetchSettleUpSuggestions();
    }
  }, [household]);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense: any) => {
    // Map API response to match form state keys
    const expenseForEdit = {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      category: expense.category || "other",
      payerId: expense.payerId, // Keep the original payerId
      payerName: expense.payerName, // Add the payerName for display
      splitMethod: expense.splitMethod || "EQUALLY",
      // Convert shares to participants format for the form
      participants: expense.shares.map((share: any) => {
        // Find the corresponding household member
        const nameParts = share.participantName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        // Find the member ID from the household members
        const member = household?.members.find(
          (m: any) => m.firstName === firstName && m.lastName === lastName
        );

        return {
          id: member?.id || 0,
          firstName,
          lastName,
          amount: share.shareAmount,
          isSelected: true,
        };
      }),
    };

    setSelectedExpense(expenseForEdit);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
    setIsViewMode(false);
  };

  const handleSaveExpense = async (expenseData: any) => {
    try {
      if (selectedExpense?.id) {
        // Update existing expense
        await householdApi.put(
          `/api/expenses/update/${selectedExpense.id}`,
          expenseData
        );
      } else {
        // Create new expense
        await householdApi.post("/api/expenses/add", expenseData);
      }

      // Refresh expenses list, balances, and settlement suggestions
      fetchExpenses();
      fetchBalances();
      fetchSettleUpSuggestions();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await householdApi.delete(`/api/expenses/delete/${id}`);
        // Refresh expenses list, balances, and settlement suggestions
        fetchExpenses();
        fetchBalances();
        fetchSettleUpSuggestions();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete expense");
      }
    }
  };

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (filterDateRange) {
      case "week":
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return (date: Date) => date >= weekAgo;
      case "month":
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return (date: Date) => date >= monthAgo;
      case "year":
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        return (date: Date) => date >= yearAgo;
      default:
        return () => true;
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    // Filter by payer
    if (filterPaidBy !== "all" && expense.payerName !== filterPaidBy)
      return false;

    // Filter by category
    if (
      filterCategory !== "all" &&
      expense.category?.toLowerCase() !== filterCategory
    )
      return false;

    // Filter by date range
    const dateFilter = getDateRangeFilter();
    console.log('Expense for date filtering:', expense.id, expense.addedAt);
    return dateFilter(parseCustomDateString(expense.addedAt));
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Helper functions for category styling
  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "groceries":
        return "bg-green-500";
      case "utilities":
        return "bg-blue-500";
      case "rent":
        return "bg-purple-500";
      case "entertainment":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "groceries":
        return "🛒";
      case "utilities":
        return "💡";
      case "rent":
        return "🏠";
      case "entertainment":
        return "🎬";
      default:
        return "💰";
    }
  };

  if (!household) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Household Found</h2>
          <p>You need to create or join a household to manage expenses.</p>
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
            <h1 className="text-2xl font-bold text-white">
              Household Expenses
            </h1>
            <p className="text-blue-100 mt-1">
              Track and manage expenses for your household
            </p>
          </div>
          <button
            onClick={handleAddExpense}
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
            Add New Expense
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => {
              setActiveTab("expenses");
              setSearchParams({});
            }}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "expenses"
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Expenses
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab("balances");
              setSearchParams({ tab: "balances" });
            }}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === "balances"
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
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
              Balances
            </div>
          </button>
        </div>

        {activeTab === "expenses" ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}

            {/* Filters */}
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <label
                    htmlFor="filterCategory"
                    className="mr-2 text-sm font-medium text-gray-600"
                  >
                    Category:
                  </label>
                  <select
                    id="filterCategory"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="groceries">Groceries</option>
                    <option value="utilities">Utilities</option>
                    <option value="rent">Rent</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="filterPaidBy"
                    className="mr-2 text-sm font-medium text-gray-600"
                  >
                    Paid By:
                  </label>
                  <select
                    id="filterPaidBy"
                    value={filterPaidBy}
                    onChange={(e) => setFilterPaidBy(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Members</option>
                    {household?.members?.map((member: any) => (
                      <option
                        key={member.id}
                        value={`${member.firstName} ${member.lastName}`}
                      >
                        {member.firstName} {member.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="filterDateRange"
                    className="mr-2 text-sm font-medium text-gray-600"
                  >
                    Date Range:
                  </label>
                  <select
                    id="filterDateRange"
                    value={filterDateRange}
                    onChange={(e) =>
                      setFilterDateRange(
                        e.target.value as "all" | "week" | "month" | "year"
                      )
                    }
                    className="p-2 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading expenses...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-red-500 font-medium">{error}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Please try again later
                  </p>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-12 px-4">
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
                  <p className="text-gray-500 font-medium">No expenses found</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters or add a new expense
                  </p>
                </div>
              ) : (
                <ExpenseList
                  expenses={filteredExpenses}
                  loading={loading}
                  error={error}
                  onEditExpense={handleEditExpense}
                  onViewExpense={handleViewExpense}
                  onDeleteExpense={handleDeleteExpense}
                  getCategoryColor={getCategoryColor}
                  getCategoryIcon={getCategoryIcon}
                />
              )}
            </div>
          </div>
        ) : (
          // Balances Tab
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <ExpenseBalances
              netBalances={netBalances}
              loadingBalances={loadingBalances}
              settleUpSuggestions={settleUpSuggestions}
              loadingSettleUpSuggestions={loadingSettleUpSuggestions}
            />
          </div>
        )}

        {/* Expense Modal */}
        {isModalOpen && (
          <ExpenseModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            expense={selectedExpense}
            onSave={handleSaveExpense}
            isViewMode={isViewMode}
          />
        )}
      </div>
    </div>
  );
};

export default Expenses;
