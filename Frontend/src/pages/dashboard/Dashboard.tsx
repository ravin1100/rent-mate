import React, { useEffect, useState, useRef, KeyboardEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useHousehold, householdApi } from "../../contexts/HouseholdContext";
import HouseholdModal from "../../components/household/HouseholdModal";
// import { Chore } from '../../models/Chore';
// import { Expense } from '../../models/Expense';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { household } = useHousehold();
  const [upcomingChores, setUpcomingChores] = useState<any[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [netBalances, setNetBalances] = useState<any[]>([]);
  const [settleUpSuggestions, setSettleUpSuggestions] = useState<any[]>([]);
  // Component-specific loading and error states
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [expensesError, setExpensesError] = useState<string | null>(null);

  const [choresLoading, setChoresLoading] = useState(true);
  const [choresError, setChoresError] = useState<string | null>(null);

  const [balancesLoading, setBalancesLoading] = useState(true);
  const [balancesError, setBalancesError] = useState<string | null>(null);

  // Modal-related states
  const [success, setSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [showHouseholdModal, setShowHouseholdModal] = useState(false);

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Check if user needs to create/join a household
  useEffect(() => {
    // If user is logged in but doesn't have a household, show the modal
    // This would typically check a isFirstLogin flag from the auth context
    // For now, we'll check if user exists but household doesn't
    if (user.firstLogin) {
      setShowHouseholdModal(true);
    }
  }, [user, household]);

  useEffect(() => {
    if (!household) return;

    // Fetch chores data separately
    const fetchChoresData = async () => {
      try {
        setChoresLoading(true);
        // Fetch upcoming chores from API
        const response = await householdApi.get('/api/chores/household/all-chores');
        
        // Process the chores data to ensure dates are properly formatted
        const processedChores = response.data.map((chore: any) => ({
          ...chore,
          // Ensure dueDate is a proper date object
          dueDate: chore.dueDate ? new Date(chore.dueDate) : null,
          // Format completedAt if it exists
          completedAt: chore.completedAt ? new Date(chore.completedAt) : null
        }));
        
        // Sort chores by due date (closest first)
        const sortedChores = processedChores.sort((a: any, b: any) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        
        // Get only 3 chores for the dashboard
        setUpcomingChores(sortedChores.slice(0, 3));
        setChoresError(null);
      } catch (err: any) {
        console.error("Failed to fetch chores:", err);
        setChoresError("Unable to load chores. Please try again later.");
        setUpcomingChores([]);
      } finally {
        setChoresLoading(false);
      }
    };

    // Fetch expenses data separately
    const fetchExpensesData = async () => {
      try {
        setExpensesLoading(true);
        // Fetch recent expenses from API
        const expensesResponse = await householdApi.get(
          `/api/expenses/get-all`
        );
        // Slice to get only the 3 most recent expenses
        setRecentExpenses(expensesResponse.data.slice(0, 3));
        setExpensesError(null);
      } catch (err: any) {
        console.error("Failed to fetch expenses:", err);
        setExpensesError("Unable to load expenses. Please try again later.");
        // Fallback to dummy data if API fails
        try {
          const { dummyExpenses } = await import("../../data/dummyData");
          setRecentExpenses(dummyExpenses.slice(0, 3));
          setExpensesError(null);
        } catch (fallbackErr) {
          setRecentExpenses([]);
        }
      } finally {
        setExpensesLoading(false);
      }
    };

    const fetchBalanceData = async () => {
      try {
        setBalancesLoading(true);

        // Fetch net balances
        const balanceResponse = await householdApi.get(
          `/api/settlement/balances`
        );
        setNetBalances(balanceResponse.data);

        // Fetch settlement suggestions
        const suggestionsResponse = await householdApi.get(
          `/api/settlement/settle-up-suggestion`
        );
        setSettleUpSuggestions(suggestionsResponse.data);
        setBalancesError(null);
      } catch (err: any) {
        console.error("Failed to fetch balance data:", err);
        setBalancesError(
          "Unable to load balance information. Please try again later."
        );
        setNetBalances([]);
        setSettleUpSuggestions([]);
      } finally {
        setBalancesLoading(false);
      }
    };

    fetchChoresData();
    fetchExpensesData();
    fetchBalanceData();
  }, [household]);

  // Handle closing the household modal
  const handleCloseModal = () => {
    setShowHouseholdModal(false);
  };

  // Invite modal functions
  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
    setEmailList([]);
    setEmailInput("");
    setError(null);
    setSuccess(null);
    // Focus the email input when modal opens
    setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 100);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleEmailInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      addEmail();
    } else if (
      e.key === "Backspace" &&
      emailInput === "" &&
      emailList.length > 0
    ) {
      // Remove the last email chip when backspace is pressed on empty input
      const newEmailList = [...emailList];
      newEmailList.pop();
      setEmailList(newEmailList);
    }
  };

  const addEmail = () => {
    const email = emailInput.trim().replace(/,/g, "");
    if (email && isValidEmail(email) && !emailList.includes(email)) {
      setEmailList([...emailList, email]);
      setEmailInput("");
    }
  };

  const removeEmail = (index: number) => {
    const newEmailList = [...emailList];
    newEmailList.splice(index, 1);
    setEmailList(newEmailList);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendInvites = async () => {
    if (emailList.length === 0 || !household) return;

    try {
      setIsSendingInvites(true);
      setInviteError(null);
      setSuccess(null);

      // Call the API to send invites using the correct endpoint
      await householdApi.post(`/api/households/${household.id}/send-invite`, {
        emails: emailList,
      });

      setSuccess("Invitations sent successfully!");
      setEmailList([]);
      setTimeout(() => {
        handleCloseInviteModal();
      }, 2000);
    } catch (err: any) {
      setInviteError(
        err.response?.data?.message ||
          "Failed to send invites. Please try again."
      );
    } finally {
      setIsSendingInvites(false);
    }
  };

  // If no user, show login prompt
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to RentMate!</h2>
          <p className="mb-6">Please log in or sign up to get started.</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Household Modal */}
      {/* <HouseholdModal isOpen={showHouseholdModal} onClose={handleCloseModal} /> */}

      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-blue-100 mt-1">
              Welcome back, {user.firstName || "User"}!
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-sm">
              <div className="font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-xs text-blue-100">
                {household?.name || "Your Household"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No global error message here anymore - errors are handled at the component level */}

      {!household ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-md shadow-sm relative mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Household Required
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                You need to create or join a household to see your dashboard.
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowHouseholdModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Set Up Household
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Balance and Settlement Section */}
            <div className="bg-white p-6 rounded-xl shadow-md h-full border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Your Balance
                </h2>
                <Link
                  to="/dashboard/expenses?tab=balances"
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center group"
                >
                  <span>View details</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>

              {balancesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : balancesError ? (
                <div className="text-red-500 text-sm py-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {balancesError}
                </div>
              ) : (
                <div>
                  {/* User's balance */}
                  <div className="mb-6">
                    {netBalances.find(
                      (balance) => balance.userId === user?.id
                    ) ? (
                      <div className="flex items-center">
                        <div
                          className={`text-2xl font-bold ${
                            netBalances.find(
                              (balance) => balance.userId === user?.id
                            )?.netBalance >= 0
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          ₹
                          {netBalances
                            .find((balance) => balance.userId === user?.id)
                            ?.netBalance.toFixed(2)}
                        </div>
                        <div className="ml-3 text-gray-600">
                          {netBalances.find(
                            (balance) => balance.userId === user?.id
                          )?.netBalance >= 0
                            ? "You are owed money"
                            : "You owe money"}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No balance information available
                      </p>
                    )}
                  </div>

                  {/* Settlement suggestions */}
                  {settleUpSuggestions.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium mb-3 text-gray-700">
                        Suggested Settlements
                      </h3>
                      <div className="max-h-48 overflow-y-auto pr-1 space-y-3">
                        {settleUpSuggestions
                          .filter(
                            (suggestion) =>
                              suggestion.fromUserId === user?.id ||
                              suggestion.toUserId === user?.id
                          )
                          .map((suggestion, index) => (
                            <div
                              key={`suggestion-${index}`}
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
                                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
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
                                    {suggestion.fromUserId === user?.id
                                      ? `You pay ${suggestion.toUserName}`
                                      : `${suggestion.fromUserName} pays you`}
                                  </p>
                                </div>
                              </div>
                              <div className="font-bold text-gray-800">
                                ₹{suggestion.amount.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        {settleUpSuggestions.filter(
                          (s) =>
                            s.fromUserId === user?.id || s.toUserId === user?.id
                        ).length > 2 && (
                          <Link
                            to="/dashboard/expenses?tab=balances"
                            className="text-blue-600 hover:text-blue-800 text-sm block text-center mt-2"
                          >
                            View all settlement suggestions →
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Upcoming Chores
                </h2>
                <Link
                  to="/dashboard/chores"
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center group"
                >
                  <span>View all</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              {choresLoading ? (
                <p>Loading chores...</p>
              ) : choresError ? (
                <div className="text-red-500 text-sm py-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {choresError}
                </div>
              ) : upcomingChores.length === 0 ? (
                <p className="text-gray-500">No upcoming chores</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {upcomingChores?.map((chore) => (
                    <li key={chore.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{chore.name}</p>
                          <p className="text-sm text-gray-500">
                            Assigned to: {chore.assignedUserName || 'Unassigned'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
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
                            {chore.dueDate ? new Date(chore.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'No due date'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {chore.frequency.charAt(0).toUpperCase() + chore.frequency.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Recent Expenses
                </h2>
                <Link
                  to="/dashboard/expenses?tab=expenses"
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center group"
                >
                  <span>View all</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              {expensesLoading ? (
                <p>Loading expenses...</p>
              ) : expensesError ? (
                <div className="text-red-500 text-sm py-2 flex items-center">
                  <svg
                    className="h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {expensesError}
                </div>
              ) : recentExpenses.length === 0 ? (
                <p className="text-gray-500">No recent expenses</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {recentExpenses?.map((expense) => (
                    <li key={expense.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium capitalize">
                            {expense.category || "Other"}
                          </p>
                          <p className="text-base text-gray-700">
                            {expense.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Paid by: {expense.payerName}
                          </p>
                        </div>
                        <div className="font-medium">
                          ₹{expense.amount.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-4">Household Members</h2>
              <ul className="divide-y divide-gray-200">
                {household?.members?.map((member) => (
                  <li key={member.userId} className="py-3 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                      {member?.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{member?.userId}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {`${member.firstName} ${member.lastName}`}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {`${member.role === "ROLE_OWNER" ? "Owner" : "Member"}`}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/dashboard/chores"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                >
                  Add Chore
                </Link>
                <Link
                  to="/dashboard/expenses"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                >
                  Log Expense
                </Link>
                <Link
                  to="/dashboard/calendar"
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-center"
                >
                  View Calendar
                </Link>
                <button
                  onClick={handleOpenInviteModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-center w-full"
                >
                  Invite Member
                </button>
              </div>
            </div>
          </div>

          {/* Invite Modal */}
          {showInviteModal && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  onClick={handleCloseInviteModal}
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  {/* Modal Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">Invite People</h3>
                      <button
                        onClick={handleCloseInviteModal}
                        className="text-white hover:text-gray-200 focus:outline-none"
                      >
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
                  </div>
                  
                  {/* Modal Content */}
                  <div className="bg-white px-6 py-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Enter email addresses of people you want to invite to your household.
                      They'll receive an invitation to join.
                    </p>
                    
                    {/* Email Input Area */}
                    <div className="border border-gray-300 rounded-md p-2 mb-4 min-h-[100px] flex flex-wrap items-start">
                      {emailList.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm m-1"
                        >
                          <span>{email}</span>
                          <button
                            onClick={() => removeEmail(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <input
                        ref={emailInputRef}
                        type="text"
                        value={emailInput}
                        onChange={handleEmailInputChange}
                        onKeyDown={handleEmailInputKeyDown}
                        onBlur={() => emailInput.trim() && addEmail()}
                        className="flex-grow min-w-[120px] p-1 border-0 focus:ring-0 focus:outline-none"
                        placeholder={
                          emailList.length === 0
                            ? "Type email addresses here"
                            : ""
                        }
                      />
                    </div>
                    
                    {/* Error and Success Messages */}
                    {inviteError && (
                      <div className="text-red-500 text-sm mb-4 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {inviteError}
                      </div>
                    )}
                    {success && (
                      <div className="text-green-500 text-sm mb-4">
                        {success}
                      </div>
                    )}
                  </div>
                  
                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
                      onClick={handleCloseInviteModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none flex items-center justify-center"
                      onClick={handleSendInvites}
                      disabled={emailList.length === 0 || isSendingInvites}
                    >
                      {isSendingInvites ? (
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
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                          </svg>
                          Send Invites
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
