import React, { useState, useEffect } from "react";
import { useHousehold } from "../../contexts/HouseholdContext";
import { householdApi } from "../../contexts/HouseholdContext";
import { useAuth } from "../../contexts/AuthContext";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: any; // For editing existing expense
  onSave: (expense: any) => void;
  isViewMode?: boolean; // For viewing expense details
}

interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  amount: number;
  isSelected: boolean;
}

interface ExpenseParticipant {
  userId: number;
  customShare: number;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSave,
  isViewMode = false,
}) => {
  const { household } = useHousehold();
  const { user } = useAuth();
  const [isPreviewMode, setIsPreviewMode] = useState(isViewMode);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [paidById, setPaidById] = useState<number | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [splitMethod, setSplitMethod] = useState("EQUALLY"); // 'EQUALLY' or 'CUSTOM'
  const [error, setError] = useState<string | null>(null);

  // Initialize form with existing expense data if editing
  useEffect(() => {
    if (expense) {
      setDescription(expense.description || "");
      setAmount(expense.amount ? expense.amount.toString() : "");
      setCategory(expense.category || "other");

      // Set the payer ID from the expense data
      if (expense.payerId) {
        setPaidById(expense.payerId);
      } else if (expense.payerName && household?.members) {
        // If we have payerName but no payerId, find the payer ID from household members
        const payerNameParts = expense.payerName.split(" ");
        const firstName = payerNameParts[0];
        const lastName = payerNameParts.slice(1).join(" ");

        const payer = household.members.find(
          (m: any) => m.firstName === firstName && m.lastName === lastName
        );

        if (payer) {
          console.log("Found payer ID from household members:", payer.id);
          setPaidById(payer.id);
        }
      }

      // Set the split method from the expense data
      if (expense.splitMethod) {
        setSplitMethod(expense.splitMethod);
      }
    } else {
      // Set current user as payer by default
      if (user) {
        setPaidById(user.id);
      }
    }
  }, [expense, user, household]);

  // Initialize participants from household members or from expense data if editing/viewing
  useEffect(() => {
    if (household && household.members) {
      if (expense) {
        if (expense.participants) {
          // If editing and participants are already in the correct format
          setParticipants(expense.participants);
        } else if (expense.shares) {
          // If editing or viewing an existing expense, create participants from the shares
          // Create participants only for those who are in the expense shares
          const participantsFromShares = expense.shares
            .map((share: any) => {
              // Find the member that matches this share
              const member = household.members.find(
                (m: any) =>
                  `${m.firstName} ${m.lastName}` === share.participantName
              );

              if (member) {
                return {
                  id: member.id,
                  firstName: member.firstName,
                  lastName: member.lastName,
                  amount: share.shareAmount,
                  isSelected: true, // Always selected since they're in the expense
                };
              }
              return null;
            })
            .filter(Boolean); // Remove any null entries

          setParticipants(participantsFromShares);
        }
      } else {
        // For new expenses, initialize all household members
        const initialParticipants = household.members.map((member: any) => ({
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          amount: 0, // Will be calculated based on split method
          isSelected: true, // All members selected by default
        }));
        setParticipants(initialParticipants);
      }
    }
  }, [household, expense, isViewMode]);

  // Calculate split amounts when participants or amount changes
  useEffect(() => {
    if (splitMethod === "EQUALLY") {
      calculateEqualSplit();
    }
  }, [participants, amount, splitMethod]);

  const calculateEqualSplit = () => {
    const totalAmount = parseFloat(amount) || 0;
    const selectedParticipants = participants.filter((p) => p.isSelected);

    if (selectedParticipants.length === 0 || totalAmount === 0) return;

    const amountPerPerson = totalAmount / selectedParticipants.length;

    setParticipants((prev) =>
      prev.map((participant) => ({
        ...participant,
        amount: participant.isSelected ? amountPerPerson : 0,
      }))
    );
  };

  const handleParticipantToggle = (id: number) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id
          ? { ...participant, isSelected: !participant.isSelected }
          : participant
      )
    );
  };

  const handleParticipantAmountChange = (id: number, newAmount: string) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id
          ? { ...participant, amount: parseFloat(newAmount) || 0 }
          : participant
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Valid amount is required");
      return;
    }

    if (paidById === null) {
      setError("Paid by is required");
      return;
    }

    const selectedParticipants = participants.filter((p) => p.isSelected);
    if (selectedParticipants.length === 0) {
      setError("At least one participant must be selected");
      return;
    }

    // If everything is valid, show preview
    setError(null);
    setIsPreviewMode(true);
  };

  const handleSave = async () => {
    // Format data according to API structure
    const expenseData = {
      description,
      amount: parseFloat(amount),
      // Use the original payerId from the expense if editing, otherwise use the selected paidById
      payerId: expense?.payerId || paidById,
      participants: participants
        .filter((p) => p.isSelected)
        .map((p) => ({
          userId: p.id,
          customShare: p.amount,
        })),
      // Ensure category is never null by providing a default value
      category: category || "other",
      splitMethod,
    };

    // Log the data being sent to the API for debugging
    console.log("Expense data being sent to API:", expenseData);

    onSave(expenseData);
    onClose();
  };

  if (!isOpen) return null;

  const totalParticipantAmount = participants
    .filter((p) => p.isSelected)
    .reduce((sum, p) => sum + p.amount, 0);

  const amountDifference = Math.abs(
    parseFloat(amount) - totalParticipantAmount
  );
  const hasAmountDiscrepancy = amountDifference > 0.01; // Allow for small floating point errors

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {isViewMode
                ? "View Expense Details"
                : isPreviewMode
                ? "Review Expense"
                : expense
                ? "Edit Expense"
                : "Add New Expense"}
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
          {isPreviewMode ? (
          // Preview Mode
          <div>
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h4 className="font-medium text-blue-800 mb-2">
                Expense Summary
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-600">Description:</div>
                <div className="text-sm font-medium">{description}</div>

                <div className="text-sm text-gray-600">Amount:</div>
                <div className="text-sm font-medium">
                  ${parseFloat(amount).toFixed(2)}
                </div>

                <div className="text-sm text-gray-600">Category:</div>
                <div className="text-sm font-medium capitalize">{category}</div>

                <div className="text-sm text-gray-600">Paid by:</div>
                <div className="text-sm font-medium">{expense?.payerName}</div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Participants</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                {expense?.shares
                  ? // If we have shares from the API response
                    expense.shares.map((participant, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center mb-2 last:mb-0"
                      >
                        <span>{participant.participantName}</span>
                        <span className="font-medium">
                          ${participant.shareAmount.toFixed(2)}
                        </span>
                      </div>
                    ))
                  : // If we have participants from the form state
                    participants
                      .filter((p) => p.isSelected)
                      .map((participant, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center mb-2 last:mb-0"
                        >
                          <span>
                            {participant.firstName} {participant.lastName}
                          </span>
                          <span className="font-medium">
                            ${participant.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}

                {hasAmountDiscrepancy && (
                  <div className="mt-2 text-red-600 text-sm">
                    Warning: The sum of participant amounts ($
                    {totalParticipantAmount.toFixed(2)}) doesn't match the total
                    expense amount (${parseFloat(amount).toFixed(2)}).
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              {isViewMode ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {expense ? "Update Expense" : "Save Expense"}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full pl-7 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="groceries">Groceries</option>
                  <option value="rent">Rent</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="transportation">Transportation</option>
                  <option value="food">Food & Dining</option>
                  <option value="household">Household Items</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="paidBy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Paid By*
                </label>
                {expense?.payerName ? (
                  // If editing, show the payer name as disabled input but keep the paidById value
                  <div>
                    <input
                      type="text"
                      value={expense.payerName}
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                    <input
                      type="hidden"
                      value={expense.payerId}
                      // This ensures the payerId is included in the form submission
                    />
                  </div>
                ) : (
                  // If creating new, show the dropdown
                  <select
                    id="paidBy"
                    value={paidById || ""}
                    onChange={(e) => setPaidById(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select who paid</option>
                    {household?.members?.map((member: any) => (
                      <option key={member.id} value={member.id}>
                        {member.firstName} {member.lastName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label
                  htmlFor="splitMethod"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Split Method
                </label>
                <select
                  id="splitMethod"
                  value={splitMethod}
                  onChange={(e) => setSplitMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="EQUALLY">Equal Split</option>
                  <option value="CUSTOM">Custom Amount</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2 mb-3">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description*
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 gap-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 ${participant.isSelected 
                        ? "bg-blue-100 border border-blue-300 shadow-sm" 
                        : "bg-white border border-gray-200 hover:bg-gray-100"}`}
                      onClick={() => handleParticipantToggle(participant.id)}
                    >
                      <div className="flex items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${participant.isSelected 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 text-gray-600"}`}>
                          {participant.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{participant.firstName} {participant.lastName}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {participant.isSelected && splitMethod !== "EQUALLY" && (
                          <div className="relative w-24 mr-3">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-xs">₹</span>
                            </div>
                            <input
                              type="number"
                              value={participant.amount.toFixed(2)}
                              onChange={(e) =>
                                handleParticipantAmountChange(
                                  participant.id,
                                  e.target.value
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              step="0.01"
                              min="0"
                              className="w-full pl-5 p-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}

                        {participant.isSelected && splitMethod === "EQUALLY" && (
                          <div className="text-sm font-medium mr-3 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                            ₹{participant.amount.toFixed(2)}
                          </div>
                        )}
                        
                        <input
                          type="checkbox"
                          id={`participant-${participant.id}`}
                          checked={participant.isSelected}
                          onChange={() => handleParticipantToggle(participant.id)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {hasAmountDiscrepancy && splitMethod !== "EQUALLY" && (
                <div className="mt-2 text-red-600 text-sm">
                  Warning: The sum of participant amounts (₹
                  {totalParticipantAmount.toFixed(2)}) doesn't match the total
                  expense amount (₹{parseFloat(amount).toFixed(2)}).
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {expense ? "Update" : "Continue"}
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
