import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { householdApi, useHousehold } from "../../contexts/HouseholdContext";

const HouseholdSettings: React.FC = () => {
  const { user } = useAuth();
  const {
    household,
    updateHousehold,
    leaveHousehold,
    generateInviteCode,
    removeMember,
  } = useHousehold();
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (household) {
      setHouseholdName(household.name);
      setInviteCode(household.inviteCode || "");
    }
  }, [household]);

  if (!user || !household) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Household Found</h2>
          <p>You need to create or join a household first.</p>
        </div>
      </div>
    );
  }

  const handleUpdateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsUpdating(true);

    try {
      await updateHousehold({ ...household, name: householdName });
      setSuccess("Household updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update household");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenInviteModal = () => {
    setShowInviteModal(true);
    setEmailList([]);
    setEmailInput("");
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
    if (emailList.length === 0) return;

    setError(null);
    setSuccess(null);
    setIsSendingInvites(true);

    try {
      // First generate an invite code if we don't have one
      if (!inviteCode) {
        const code = await generateInviteCode();
        setInviteCode(code);
      }

      // Call the API to send invites
      await householdApi.post(`/api/households/${household.id}/send-invite`, {
        emails: emailList,
      });

      setSuccess(
        `Invitations sent to ${emailList.length} email${
          emailList.length > 1 ? "s" : ""
        }`
      );
      setShowInviteModal(false);
      setEmailList([]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invites");
    } finally {
      setIsSendingInvites(false);
    }
  };

  const handleLeaveHousehold = async () => {
    if (
      window.confirm(
        "Are you sure you want to leave this household? This action cannot be undone."
      )
    ) {
      setError(null);
      setIsLeaving(true);

      try {
        await leaveHousehold();
        navigate("/dashboard");
      } catch (err: any) {
        setError(err.message || "Failed to leave household");
        setIsLeaving(false);
      }
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await removeMember(memberId);
        setSuccess("Member removed successfully");
      } catch (err: any) {
        setError(err.message || "Failed to remove member");
      }
    }
  };

  // Add a function to check if a user is the owner
  const isOwner = (role: string) => role === "ROLE_OWNER";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Household Settings</h1>
        <p className="text-gray-500">
          Manage your household preferences and members
        </p>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Household Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6">Household Information</h2>
          <div>
            <label
              htmlFor="householdName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Household Name
            </label>
            <input
              type="text"
              id="householdName"
              value={householdName}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700"
            />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Invite Members</h3>
            <p className="text-sm text-gray-500 mb-4">
              Send email invitations to people you want to join your household
            </p>
            <button
              onClick={handleOpenInviteModal}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              // disabled={!isOwner(user.role)}
            >
              Send Invitations
            </button>

            {inviteCode && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invite Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={inviteCode}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode);
                      setSuccess("Invite code copied to clipboard");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You can also share this code directly with people you want to
                  invite
                </p>
              </div>
            )}
          </div>

          {/* Leave Household section removed */}
        </div>

        {/* Members List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6">Household Members</h2>
          <div className="space-y-4">
            {!household?.members || household.members.length === 0 ? (
              <p>No members found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {household.members.map((member) => (
                  <li
                    key={member.id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      {member.role === "ROLE_OWNER" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Owner
                        </span>
                      )}
                    </div>
                    {isOwner(user.role) && !isOwner(member.role) && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Invite People</h3>
              <button
                onClick={handleCloseInviteModal}
                className="text-gray-500 hover:text-gray-700"
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

            <p className="text-sm text-gray-600 mb-4">
              Enter email addresses of people you want to invite to your
              household.
            </p>

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
                  emailList.length === 0 ? "Type email addresses here" : ""
                }
              />
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseInviteModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvites}
                disabled={emailList.length === 0 || isSendingInvites}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingInvites ? "Sending..." : "Send Invites"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdSettings;
