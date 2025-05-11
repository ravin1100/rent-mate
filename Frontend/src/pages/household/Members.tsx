import React, { useState, useEffect } from "react";
import { useHousehold } from "../../contexts/HouseholdContext";

const Members: React.FC = () => {
  const { household, members, removeMember } = useHousehold();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!household) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Household Found</h2>
          <p>You need to create or join a household to view members.</p>
        </div>
      </div>
    );
  }

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

  // Check if current user is the owner
  // const isOwner = members.some((member) => member.role === "ROLE_OWNER");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Household Members</h1>
        <p className="text-gray-500">
          View and manage members in your household
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Members List</h2>

          {!household.members || household.members.length === 0 ? (
            <p>No members found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    {/* {isOwner && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    )} */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {household.members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                            <span>
                              {member.firstName?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {member.firstName} {member.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.role === "ROLE_OWNER" ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Owner
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Member
                          </span>
                        )}
                      </td>
                      {/* {isOwner && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {member.role !== "ROLE_OWNER" && (
                            <button
                              onClick={() =>
                                handleRemoveMember(member.id.toString())
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      )} */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
